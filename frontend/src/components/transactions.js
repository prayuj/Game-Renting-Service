import React, { Component } from "react";
import axios from "axios";
import Transaction from "./transaction";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      filtered: [],
      ascendingCustomerName: true,
      ascendingGameName: true,
      ascendingDateIssue: true,
      ascendingDateReturn: true,
      customerNameSortButtonValue: "Sort",
      gameNameSortButtonValue: "Sort",
      dateIssueButtonValue: <span>&darr;</span>,
      dateReturnButtonValue: "Sort"
    };
    this.handleChange = this.handleChange.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.onClickForSort = this.onClickForSort.bind(this);
    this.getDates = this.getDates.bind(this);
  }
  componentDidMount() {
    this.getTransactions();
  }
  getTransactions() {
    axios.get("http://localhost:4000/transaction").then(res =>
      this.setState({
        transactions: res.data,
        filtered: res.data
      })
    );
  }
  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    return today;
  }

  handleChange(e) {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      //console.log("HERE 1");
      // Assign the original list to currentList
      currentList = this.state.transactions;
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
      newList = this.state.transactions;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filtered: newList
    });
  }
  onClickForSort(e) {
    console.log(e.target.value);
    if (e.target.value === "Customer Name") {
      let transactions = this.state.filtered;
      transactions.sort((a, b) => {
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
      console.log(transactions);
      let arrow = this.state.ascendingCustomerName ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: transactions,
        ascendingCustomerName: !this.state.ascendingCustomerName,
        customerNameSortButtonValue: arrow,
        gameNameSortButtonValue: "Sort",
        dateIssueButtonValue: "Sort",
        dateReturnButtonValue: "Sort"
      });
    }
    if (e.target.value === "Game Name") {
      let transactions = this.state.filtered;
      transactions.sort((a, b) => {
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
      console.log(transactions);
      let arrow = this.state.ascendingGameName ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: transactions,
        ascendingGameName: !this.state.ascendingGameName,
        gameNameSortButtonValue: arrow,
        customerNameSortButtonValue: "Sort",
        dateIssueButtonValue: "Sort",
        dateReturnButtonValue: "Sort"
      });
    }
    if (e.target.value === "Date Issue") {
      let transactions = this.state.filtered;
      transactions.sort((a, b) => {
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
        filtered: transactions,
        ascendingDateIssue: !this.state.ascendingDateIssue,
        dateIssueButtonValue: arrow,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
        dateReturnButtonValue: "Sort"
      });
    }
    if (e.target.value === "Date Return") {
      let transactions = this.state.filtered;
      transactions.sort((a, b) => {
        if (this.state.ascendingDateReturn) {
          if (a.return && b.return) {
            var x = a.date_return;
            var y = b.date_return;
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          } else if (!a.return && b.return) {
            return 1;
          } else if (a.return && !b.return) {
            return -1;
          } else {
            var x = a.date_issue;
            var y = b.date_issue;
            if (x < y) {
              return 1;
            }
            if (x > y) {
              return -1;
            }
            return 0;
          }
        }
        if (!this.state.ascendingDateReturn) {
          if (a.return && b.return) {
            var x = a.date_return;
            var y = b.date_return;
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          } else if (!a.return && b.return) {
            return -1;
          } else if (a.return && !b.return) {
            return 1;
          } else {
            var x = a.date_issue;
            var y = b.date_issue;
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          }
        }
      });
      let arrow = this.state.ascendingDateReturn ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: transactions,
        ascendingDateReturn: !this.state.ascendingDateReturn,
        dateReturnButtonValue: arrow,
        customerNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort",
        gameNameSortButtonValue: "Sort"
      });
    }
  }

  getDates(e) {
    e.preventDefault();
    if (e.target.from.value !== "" && e.target.to.value !== "") {
      console.log(
        "http://localhost:4000/transaction/dates/from=" +
          e.target.from.value +
          "&to=" +
          e.target.to.value
      );
      axios
        .get(
          "http://localhost:4000/transaction/dates/from=" +
            e.target.from.value +
            "&to=" +
            e.target.to.value
        )
        .then(res =>
          this.setState({
            transactions: res.data,
            filtered: res.data
          })
        );
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={this.handleChange}
        />
        <form onSubmit={this.getDates}>
          <input name="from" type="date" />
          to
          <input name="to" type="date" />
          <input type="submit" className="btn btn-info" value="Get" />
        </form>
        <input
          type="button"
          className="btn btn-primary"
          value="Show all"
          onClick={this.getTransactions}
        />
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: "1.3%" }}>Sr</th>
              <th style={{ paddingBottom: "1.3%" }}>Transaction ID</th>
              <th>
                Member Name{" "}
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
                Game Name{" "}
                <button
                  className="btn btn-primary"
                  value="Game Name"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.gameNameSortButtonValue}
                </button>
              </th>
              <th>
                Date Issue{" "}
                <button
                  className="btn btn-primary"
                  value="Date Issue"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.dateIssueButtonValue}
                </button>
              </th>
              <th>
                Date Return
                <button
                  className="btn btn-primary"
                  value="Date Return"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.dateReturnButtonValue}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.filtered.map((transaction, index) => (
              <Transaction
                index={index + 1}
                id={transaction._id}
                game_name={transaction.gameInfo.name}
                customer_name={transaction.customerInfo.name}
                date_issue={this.convertDate(transaction.date_issue)}
                date_return={
                  transaction.return
                    ? this.convertDate(transaction.date_return)
                    : "Not Returned"
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
