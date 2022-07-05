import React from "react";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Container } from "react-bootstrap";
import "react-funnel-pipeline/dist/index.css";

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
    };
  }

  componentDidMount() {
    contextSettings().then(({ settings, context }) =>
      getItemsPerGroupPerBoard(context.boardIds).then((store) => {
        this.setState({ settings, store }, () => {
          monday.listen("settings", ({ data: settings }) =>
            this.setState({ settings })
          );
        });
      })
    );
  }

  groupIds = () =>
    Object.values(this.state.settings.groupsPerBoard || {}).flat();
  funnelData = () => this.state.store || {};

  render() {
    return (
      <Container className="mt-4">
        <Funnel data={this.funnelData()} filters={this.groupIds()} />
      </Container>
    );
  }
}

export default App;
