import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import Funnel from "./Funnel";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from 'react-bootstrap/Spinner';

const monday = mondaySdk();
const LABEL_ERROR = 'Label Column Id';
const VALUE_ERROR = 'Value Column Id';

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {
        nameId: "text",
        valueId: "numbers",
      },
      data: [
        { name: "Awareness", value: 252 },
        { name: "Interest", value: 105 },
        { name: "Consideration", value: 84 },
      ],
      percent: [],
      funnelData: [{}],
      context: {},
      boardData: {},
      errorVal: '',
      spinner: true
    };
  }

  componentDidMount() {
    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
      if (
        this.state.settings.nameId !== "" &&
        this.state.settings.valueId !== ""
      ) {
        this.apiCall();
      }
    });

    monday.listen("context", (res) => {
      this.setState({ context: res.data });
    });

    setInterval(() => {
      this.apiCall();
    }, 60000);
  }

  apiCall = () => {
    let query = `query ($boardIds: [Int], $nameColumnId: String!, $valueColumnId: String! ) {
      boards (ids:$boardIds) {
        items {
          column_values(ids:[$nameColumnId, $valueColumnId]) {
            text
            type
          }
        } 
      } 
    }`;

    monday
      .api(query, {
        variables: {
          boardIds: this.state.context.boardIds,
          nameColumnId: this.state.settings.nameId,
          valueColumnId: this.state.settings.valueId,
        },
      })
      .then((res) => {
        this.setState({ boardData: res.data });
        if (!res.data.boards[0].items[0].column_values.some((item) => item.type === 'text')) {
          throw new Error(LABEL_ERROR);
        }
        if (!res.data.boards[0].items[0].column_values.some((item) => item.type === 'numeric')) {
          throw new Error(VALUE_ERROR);
        }
        this.setState({
          data: this.state.boardData.boards[0].items.map((item) => ({
            name:
              item.column_values[0].type === "text"
                ? item.column_values[0].text
                : item.column_values[1].text,
            value:
              item.column_values[1].type === "numeric"
                ? item.column_values[1].text
                : item.column_values[0].text,
          })),
        });
        this.calculatePercentage(this.state.data);
        this.setState({ errorVal: '' });
        this.setState({ spinner: false });
      })
      .catch((err) => {
        this.setState({ errorVal: err.message });
        console.log(err);
      });
  };

  refreshButton = () => {
    this.setState({ spinner: true });
    this.apiCall();
  };

  calculatePercentage = (data) => {
    this.setState({ percent: [] });
    this.setState({ funnelData: [{}] });
    var total = data[0].value;
    if (total === 0) {
      return;
    }

    this.setState({
      percent: data.map((item) => Math.round((item.value / total) * 100)),
    });

    this.setState({
      funnelData: this.state.data.map((item, index) => ({
        name: `${item.name} (${this.state.percent[index]}%)`,
        value: item.value,
      })),
    });
  };

  displayError = () => {
    if (this.state.errorVal === VALUE_ERROR) {
      return (<Alert variant="danger" className="mt-4">
        Could not get values for the funnel. <br />
        Please go to the settings and change the <strong>Value Column Id</strong>.
      </Alert>);
    }
    else if (this.state.errorVal === LABEL_ERROR) {
      return (<Alert variant="danger" className="mt-4">
        Could not get lables for the funnel. <br />
        Please go to the settings and change the <strong>Name Column Id</strong>.
      </Alert>);
    }
    else {
      return undefined;
    }
  };

  render() {
    return (
      <div className="container">
        {this.state.settings.nameId === "" || this.state.settings.valueId === "" ? (
          <div className="pt-4 text-center">
            <p>Please enter the id of label column and value column.</p>
          </div>
        ) : this.displayError() || (
          <div className="funnel_container pt-4">
            <Funnel className="pt-4" data={this.state.funnelData} />
            <div className="pt-4">
              <Button onClick={this.refreshButton} variant="success" size="lg" disabled={this.state.spinner ? true : false}>
                {this.state.spinner ? <Spinner animation="border" variant="default" /> : "Refresh"}
              </Button>
            </div>
          </div>
        )
        }
      </div>
    );
  }
}

export default App;