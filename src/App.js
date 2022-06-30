import React from "react";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";

import "./App.css";
import Funnel from "./Funnel";

const monday = mondaySdk();

const LABEL_ERROR = "Label Column Id";
const VALUE_ERROR = "Value Column Id";
const NAME_COLUMN = "name";

const QUERY = `
  query ($boardIds: [Int]) {
    boards (ids:$boardIds) {
      items {
        name
        column_values {
          id
          text
        }
      } 
    } 
  }`;

const AUTO_REFRESH_RATE_SECS = 60;

const addPercentagesToLabels = (data = []) =>
  [data[0]].concat(
    data.slice(1).map((item, index) => ({
      ...item,
      name: `${item.name} (${
        data[index].value <= 0
          ? 0
          : Math.round((item.value / data[index].value) * 100)
      }%)`,
    }))
  );

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      context: {},
      disabled: true,
      errorVal: "",
      funnelData: [],
      previousResponse: {},
      settings: {},
      timer: AUTO_REFRESH_RATE_SECS,
    };
  }

  componentDidMount() {
    monday.listen("context", ({ data }) => {
      this.setState({ context: data });
    });
    monday.listen("settings", ({ data }) => {
      this.setState({ settings: data });
    });
    monday.listen(["settings", "context"], () => {
      this.apiCall();
    });

    setInterval(() => {
      if (this.tickTimer() <= 0) {
        this.apiCall();
      }
    }, 1000);
  }

  boardId = () => this.boardIds()[0];
  boardIds = () => this.state.context.boardIds || [];
  labelColumn = () => this.state.settings.label?.[this.boardId()]?.[0] || "";
  valueColumn = () => this.state.settings.value?.[this.boardId()]?.[0] || "";
  funnelData = () => this.state.funnelData || [];
  resetTimer = () => this.setState({ timer: AUTO_REFRESH_RATE_SECS });
  tickTimer = (duration = 1) => {
    this.setState({ timer: this.state.timer - duration });
    return this.timer();
  };
  timer = () =>
    !this.state.timer || this.state.timer < 0 ? 0 : this.state.timer;
  timerProgress = () => (this.timer() / AUTO_REFRESH_RATE_SECS) * 100;

  cachedOrNewResponse = (boardIds = []) =>
    this.state.previousResponse.data
      ? Promise.resolve(this.state.previousResponse)
      : this.updateCache(boardIds).then(() => this.state.previousResponse);

  updateCache = (boardIds = []) =>
    monday.api(QUERY, { variables: { boardIds } }).then((res) => {
      this.setState({ previousResponse: res });
    });

  apiCall = () => {
    if (
      !this.boardIds().length ||
      this.labelColumn() === "" ||
      this.valueColumn() === ""
    ) {
      return;
    }

    this.setState({ disabled: true });
    return this.cachedOrNewResponse(this.boardIds())
      .then((res) => {
        if (
          this.labelColumn() !== NAME_COLUMN &&
          !res.data.boards
            .flatMap(({ items }) => items)
            .flatMap(({ column_values }) => column_values)
            .find(({ id }) => id === this.labelColumn())
        ) {
          throw new Error(LABEL_ERROR);
        }
        if (
          !res.data.boards
            .flatMap(({ items }) => items)
            .flatMap(({ column_values }) => column_values)
            .find(({ id }) => id === this.valueColumn())
        ) {
          throw new Error(VALUE_ERROR);
        }

        const data = res.data.boards
          .flatMap(({ items }) => items)
          .map(({ name, column_values }) => ({
            name:
              this.labelColumn() === NAME_COLUMN
                ? name
                : column_values.find(({ id }) => id === this.labelColumn())
                    ?.text || "",
            value: Number(
              column_values.find(({ id }) => id === this.valueColumn())?.text ||
                ""
            ),
          }));
        this.setState({
          funnelData: addPercentagesToLabels(data),
          errorVal: "",
        });
      })
      .catch((err) => {
        this.setState({ errorVal: err.message });
        console.error(err);
      })
      .then(() => {
        this.setState({ disabled: false });
        this.resetTimer();
      });
  };

  refreshButtonHandler = () => {
    this.setState({ disabled: true });
    this.updateCache(this.boardIds()).then(() => this.apiCall());
  };

  displayAlert = () => {
    if (!this.boardIds().length) {
      return (
        <Alert variant="info" className="mt-4">
          Please select at least 1 board
        </Alert>
      );
    } else if (this.labelColumn() === "") {
      return (
        <Alert variant="info" className="mt-4">
          Please select a label column
        </Alert>
      );
    } else if (this.valueColumn() === "") {
      return (
        <Alert variant="info" className="mt-4">
          Please select a value column
        </Alert>
      );
    } else if (this.state.errorVal === VALUE_ERROR) {
      return (
        <Alert variant="danger" className="mt-4">
          Could not get values for the funnel. <br />
          Please go to the settings and change the <strong>Value Column</strong>
          .
        </Alert>
      );
    } else if (this.state.errorVal === LABEL_ERROR) {
      return (
        <Alert variant="danger" className="mt-4">
          Could not get labels for the funnel. <br />
          Please go to the settings and change the <strong>Name Column</strong>.
        </Alert>
      );
    } else if (this.state.errorVal.length) {
      return (
        <Alert variant="danger" className="mt-4">
          Something went wrong. Please try again.
          <quote>${this.state.errorVal}</quote>
        </Alert>
      );
    } else {
      return undefined;
    }
  };

  render() {
    return (
      <div className="container">
        {this.displayAlert() || (
          <div className="funnel-container pt-4">
            <Funnel className="pt-4" data={this.funnelData()} />
            <div className="pt-4">
              <Button
                variant="success"
                size="lg"
                disabled={this.state.disabled ? true : false}
                onClick={this.refreshButtonHandler}
              >
                {this.state.disabled ? (
                  <Spinner animation="border" variant="default" />
                ) : (
                  "Refresh"
                )}
              </Button>
              <div className="mt-1">
                <ProgressBar now={this.timerProgress()} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
