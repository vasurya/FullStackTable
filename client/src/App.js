import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dispData: "BACKEND NOT CONNECTED",
      tableData: [],
      inputData: "",
    };
  }

  componentDidMount() {
    fetch("/FStable", { mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ dispData: data["exp"], tableData: data["tableData"] });
        console.log(this.state);
      });
  }
  render() {
    let tableRender = () => {
      let tbRows = this.state.tableData.map((item) => {
        return (
          <tr>
            <td>{item["_id"]}</td>
            <td>{item["rowData"]}</td>
          </tr>
        );
      });
      return tbRows;
    };
    return (
      <div className="App">
        <div id="parent uk-container">
          <div className="uk-tile uk-tile-muted" style={{ height: "100vh" }}>
            <div
              id="dyn"
              className="uk-heading-large"
              data-uk-margin
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {this.state.dispData}
              <input
                className="uk-input uk-width-1-5"
                style={{ font: "initial" }}
                value={this.state.inputData}
                onChange={(e) => {
                  this.setState({ inputData: e.target.value });
                }}
              ></input>
              <button
                class="uk-button uk-button-primary"
                style={{ height: "60px" }}
                onClick={() => {
                  // alert(this.state.inputData);

                  axios
                    .post(
                      "/FStable",
                      { inputData: this.state.inputData },
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    )
                    .then((res) => {
                      if (res.data) {
                        fetch("/FStable", { mode: "cors" })
                          .then((response) => response.json())
                          .then((data) => {
                            this.setState({
                              dispData: data["exp"],
                              tableData: data["tableData"],
                              inputData: "",
                            });
                            console.log(this.state);
                          });
                      }
                      console.log(res.data);
                    });
                }}
              >
                Save
              </button>
              <button
                class="uk-button uk-button-default"
                style={{ height: "60px" }}
                onClick={() => {
                  axios
                    .delete("/FStable", { data: { id: this.state.inputData } })
                    .then((res) => {
                      if (res.data) {
                        fetch("/FStable", { mode: "cors" })
                          .then((response) => response.json())
                          .then((data) => {
                            this.setState({
                              dispData: data["exp"],
                              tableData: data["tableData"],
                              inputData: "",
                            });
                            console.log(this.state);
                          });
                      }
                      console.log(res.data);
                    });
                }}
              >
                Delete
              </button>
            </div>
            <div>
              <table class="uk-table uk-table-divider">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>{tableRender()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
