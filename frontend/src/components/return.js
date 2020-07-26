import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import LoadingSpinner from "./loadingSpinner";

class Return extends Component {
  constructor(props) {
    super(props);
    console.log(props.match.params.id);
    if (props.match.params.mode === "customer") {
      this.state = {
        mode: "customer",
        id: props.match.params.id,
        filtered: [],
        modal_show: false,
        ascendingCustomerName: true,
        ascendingGameName: true,
        ascendingDateIssue: true,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
        dateIssueButtonValue: <span>&darr;</span>,
        otp_issued: false,
        verifying: false,
        games_to_return_loaded: false,
      };
    } else {
      this.state = {
        mode: "dashboard",
        id: "all",
        filtered: [],
        modal_show: false,
        ascendingCustomerName: true,
        ascendingGameName: true,
        ascendingDateIssue: true,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
        dateIssueButtonValue: <span>&darr;</span>,
        otp_issued: false,
        verifying: false,
        games_to_return_loaded: false,
      };
    }

    this.handleClick = this.handleClick.bind(this);
    this.confirmReturn = this.confirmReturn.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClickForSort = this.onClickForSort.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
  }

  componentDidUpdate() {
    console.log(this.state.mode, this.props.match.params.mode);
    if (this.state.mode !== this.props.match.params.mode) {
      this.setState(
        {
          mode: this.props.match.params.mode,
          id: this.props.match.params.id,
        },
        () => {
          this.getCustomerDetail();
        }
      );
    }
  }
  confirmReturn(e) {
    console.log(e.target.id);
    this.setState({
      otp_issued: false,
      verifying: false,
    });
    let ids = e.target.id.split(" ");
    axios
      .get(
        this.props.url +
          "/customer/generate_otp/id=" +
          ids[3] +
          "&mode=Returning" +
          "&game=" +
          ids[1] +
          "&console=" +
          ids[4]
      )
      .then((res) => {
        console.log(res.data);
        this.setState({ message: res.data.message, otp_issued: true });
      });
    this.setState({
      modal_show: true,
      ids: ids,
    });
  }

  modalClose() {
    {
      this.setState({ modal_show: false });
    }
  }
  getCustomerDetail() {
    axios
      .get(this.props.url + "/customer/return/" + this.state.id)
      .then((res) => {
        console.log(res.data);
        this.setState({
          games_to_return: res.data,
          filtered: res.data,
          show: true,
          games_to_return_loaded: true,
        });
      })
      .catch((err) => console.log(err));
  }

  handleChange(e) {
    console.log(e.target.value);
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      //console.log("HERE 1");
      // Assign the original list to currentList
      currentList = this.state.games_to_return;
      let firstList = [];
      let secondList = [];

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      firstList = currentList.filter((item) => {
        // change current item to lowercase
        const lc = item.gameInfo.name.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
      secondList = currentList.filter((item) => {
        // change current item to lowercase
        const lc = item.customerInfo.name.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
      newList = firstList.concat(secondList);
      //console.log(newList);
    } else {
      //console.log("HERE 2");
      // If the search bar is empty, set newList to original task list
      newList = this.state.filtered;
    }
    console.log(newList);
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filtered: newList,
    });
  }

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");
    return today + " (" + hours + ":" + minutes + " hrs)";
  }

  handleClick(e) {
    e.preventDefault();
    console.log(e.target.otp.value);
    this.setState({
      verifying: true,
    });
    let id = this.state.ids;
    axios
      .post(this.props.url + "/customer/verify_otp/" + id[3], {
        otp: e.target.otp.value,
      })
      .then((res) => {
        console.log(res.data.isVerify);
        if (res.data.isVerify) {
          axios
            .post(this.props.url + "/customer/return/", {
              transaction_id: id[0],
              game_id: id[1],
              item_id: id[2],
            })
            .then((res) => {
              console.log(res.data);
              this.getCustomerDetail();
              this.setState({
                modal_show: false,
                transactionid: id[0],
              });
              this.setRedirect();
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({ verifying: false });
          alert("Incorrect OTP, Issue again");
        }
      });
  }

  onClickForSort(e) {
    if (e.target.value === "Customer Name") {
      let games_to_return = this.state.filtered;
      games_to_return.sort((a, b) => {
        var x = a.customerInfo.name.toLowerCase();
        var y = b.customerInfo.name.toLowerCase();
        if (this.state.ascendingCustomerName) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingCustomerName) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(games_to_return);
      let arrow = this.state.ascendingCustomerName ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: games_to_return,
        ascendingCustomerName: !this.state.ascendingCustomerName,
        customerNameSortButtonValue: arrow,
        gameNameSortButtonValue: "Sort",
        dateIssueButtonValue: "Sort",
      });
    }
    if (e.target.value === "Game Name") {
      let games_to_return = this.state.filtered;
      games_to_return.sort((a, b) => {
        var x = a.gameInfo.name.toLowerCase();
        var y = b.gameInfo.name.toLowerCase();
        if (this.state.ascendingGameName) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingGameName) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(games_to_return);
      let arrow = this.state.ascendingGameName ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: games_to_return,
        ascendingGameName: !this.state.ascendingGameName,
        gameNameSortButtonValue: arrow,
        customerNameSortButtonValue: "Sort",
        dateIssueButtonValue: "Sort",
      });
    }
    if (e.target.value === "Date Issue") {
      let games_to_return = this.state.filtered;
      games_to_return.sort((a, b) => {
        var x = a.date_issue;
        var y = b.date_issue;
        if (this.state.ascendingDateIssue) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingDateIssue) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      let arrow = this.state.ascendingDateIssue ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: games_to_return,
        ascendingDateIssue: !this.state.ascendingDateIssue,
        dateIssueButtonValue: arrow,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
      });
    }
  }

  setRedirect = () => {
    this.setState({
      redirect_to_transaction: true,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_transaction) {
      return <Redirect push to={"/transaction/" + this.state.transactionid} />;
    }
  };
  render() {
    let games =
      this.state.filtered.length > 0 ? (
        this.state.filtered.map((game, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>{game.customerInfo.name}</td>
            <td>{game.gameInfo.name}</td>
            <td>{game.gameInfo.items.console}</td>
            <td>{game.gameInfo.items.serial_no}</td>
            <td>{this.convertDate(game.date_issue)}</td>
            <input
              type="button"
              value="Return"
              className="btn btn-primary"
              onClick={this.confirmReturn}
              id={
                game._id +
                " " +
                game.game_id +
                " " +
                game.item_id +
                " " +
                game.customer_id +
                " " +
                game.gameInfo.items.console
              }
            />
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="7"
            style={{ position: "relative", top: "50%", left: "50%" }}
          >
            Nothing to Show!
          </td>
        </tr>
      );
    return (
      <div>
        {this.renderRedirect()}
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={this.handleChange}
        />
        <div className="table-responsive-xl">
          <table className="table" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Sr</th>
                <th>
                  Customer Name
                  <button
                    className="btn btn-primary"
                    value="Customer Name"
                    onClick={this.onClickForSort}
                    style={{ "margin-left": "5%" }}
                  >
                    {this.state.customerNameSortButtonValue}
                  </button>
                </th>
                <th>
                  Game Name
                  <button
                    className="btn btn-primary"
                    value="Game Name"
                    onClick={this.onClickForSort}
                    style={{ "margin-left": "5%" }}
                  >
                    {this.state.gameNameSortButtonValue}
                  </button>
                </th>
                <th>Console</th>
                <th>Serial No</th>
                <th>
                  Issued
                  <button
                    className="btn btn-primary"
                    value="Date Issue"
                    onClick={this.onClickForSort}
                    style={{ "margin-left": "5%" }}
                  >
                    {this.state.dateIssueButtonValue}
                  </button>
                </th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {this.state.games_to_return_loaded ? (
                games
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{ position: "relative", top: "50%", left: "50%" }}
                  >
                    <LoadingSpinner></LoadingSpinner>
                  </td>
                </tr>
              )}
            </tbody>

            <Modal show={this.state.modal_show}>
              <Modal.Header>
                <Modal.Title>Game Return</Modal.Title>
              </Modal.Header>
              <form onSubmit={this.handleClick}>
                <Modal.Body>
                  <div>
                    Enter OTP
                    <input type="number" name="otp" />
                  </div>
                  {this.state.otp_issued ? (
                    <Toast>
                      <Toast.Header>
                        <strong className="mr-auto">OTP</strong>
                      </Toast.Header>
                      <Toast.Body>{this.state.message}</Toast.Body>
                    </Toast>
                  ) : (
                    <LoadingSpinner></LoadingSpinner>
                  )}
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={this.modalClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    {this.state.verifying ? (
                      <LoadingSpinner></LoadingSpinner>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
          </table>
        </div>
      </div>
    );
  }
}

export default Return;
