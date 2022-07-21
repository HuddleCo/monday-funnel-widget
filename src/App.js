import React from "react";
import mondaySdk from "monday-sdk-js";
import { Box, AttentionBox } from "monday-ui-react-core";

import "./App.css";

import Funnel from "./Funnel";

const monday = mondaySdk();
const getItemsPerGroupPerBoard = (boardIds = []) =>
  monday.api(
    `
      query ($boardIds: [Int]) {
        boards (ids: $boardIds) {
          groups {
            id
            title
            color
            items { 
              id
            }
          } 
        } 
      }
    `,
    { variables: { boardIds } }
  );

const contextSettings = () =>
  monday
    .get("context")
    .then(({ data: context }) =>
      monday
        .get("settings")
        .then(({ data: settings }) => ({ context, settings }))
    );
class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      store: {},
      settings: {},
      error: null,
    };
  }

  componentDidMount() {
    contextSettings()
      .then(({ settings, context }) =>
        getItemsPerGroupPerBoard(context.boardIds).then((store) =>
          this.setState({ settings, store, error: null }, () =>
            monday.listen("settings", ({ data: settings }) =>
              this.setState({ settings, error: null })
            )
          )
        )
      )
      .catch((error) => this.state({ error }));
  }

  groupIds = () =>
    Object.values(
      this.state.settings.groupsPerBoard?.group_ids_per_board ||
        this.state.settings.groupsPerBoard ||
        {}
    ).flat();
  count = (value = "count") =>
    this.state.settings.calculations === value ||
    (this.state.settings.calculations || []).includes(value);
  ratio = (value = "ratio") =>
    this.state.settings.calculations === value ||
    (this.state.settings.calculations || []).includes(value);
  percentage = (value = "percentage") =>
    this.state.settings.calculations === value ||
    (this.state.settings.calculations || []).includes(value);
  funnelData = () => this.state.store || {};

  displayError = () => {
    if (this.state.error) {
      return (
        <div>
          <Flex
            justify={Flex.justify.CENTER}
            style={{
              width: "100%",
            }}
          >
            <AttentionBox
              title="Something went wrong"
              text={this.state.error.message}
              type={AttentionBox.types.DANGER}
            />
          </Flex>
          <strong>this.state:</strong>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
      );
    }
  };

  render() {
    return (
      <Box padding={Box.paddings.LARGE}>
        {this.displayError() || (
          <Funnel
            data={this.funnelData()}
            filters={this.groupIds()}
            count={this.count()}
            ratio={this.ratio()}
            percentage={this.percentage()}
          />
        )}
      </Box>
    );
  }
}

export default App;
