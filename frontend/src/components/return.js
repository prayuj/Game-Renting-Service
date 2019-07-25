import React, { Component } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Return extends Component {
  constructor(props) {
    super(props);
    if (props.match.params.mode === "customer") {
      this.state = {
        id: props.match.params.id,
        show: false,
        filtered: [],
        modal_show: false,
        ascendingCustomerName: true,
        ascendingGameName: true,
        ascendingDateIssue: true,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
        dateIssueButtonValue: "Sort"
      };
    } else {
      this.state = {
        id: "all",
        show: false,
        filtered: [],
        modal_show: false,
        ascendingCustomerName: true,
        ascendingGameName: true,
        ascendingDateIssue: true,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
        dateIssueButtonValue: "Sort"
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

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps))
      this.getCustomerDetail();
  }
  confirmReturn(e) {
    console.log(e.target.id);
    let ids = e.target.id.split(" ");
    this.setState({
      modal_show: true,
      ids: ids
    });
  }

  modalClose() {
    {
      this.setState({ modal_show: false });
    }
  }
  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/return/" + this.state.id)
      .then(res => {
        console.log(res.data);
        if (res.data.length != 0)
          this.setState({
            games_to_return: res.data,
            filtered: res.data,
            show: true
          });
        else {
          this.setState({
            show: false
          });
        }
      })
      .catch(err => console.log(err));
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
      firstList = currentList.filter(item => {
        // change current item to lowercase
        const lc = item.gameInfo.name.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
      secondList = currentList.filter(item => {
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
      filtered: newList
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

  handleClick() {
    let id = this.state.ids;
    axios
      .post("http://localhost:4000/customer/return/" + this.state.id, {
        transaction_id: id[0],
        game_id: id[1],
        item_id: id[2]
      })
      .then(res => {
        console.log(res.data);
        this.getCustomerDetail();
        this.setState({
          modal_show: false
        });
      })
      .catch(err => console.log(err));
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
        dateIssueButtonValue: "Sort"
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
        dateIssueButtonValue: "Sort"
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
        gameNameSortButtonValue: "Sort"
      });
    }
  }
  render() {
    if (this.state.show) {
      let games = this.state.filtered.map((game, index) => (
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
            id={game._id + " " + game.game_id + " " + game.item_id}
          />
        </tr>
      ));
      return (
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            onChange={this.handleChange}
          />
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
            <tbody>{games}</tbody>
            <Modal show={this.state.modal_show}>
              <Modal.Header>
                <Modal.Title>Game Return</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Are you sure you want to Return?</p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={this.modalClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleClick}>
                  Save changes
                </Button>
              </Modal.Footer>
            </Modal>
          </table>
        </div>
      );
    } else return <div>No game to return</div>;
  }
}

export default Return;
