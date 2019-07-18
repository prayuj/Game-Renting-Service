import React, { Component } from "react";
import axios from "axios";
import Transaction from "./transaction";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      filtered: []
    };
    this.handleChange = this.handleChange.bind(this);

    this.getTransactions = this.getTransactions.bind(this);
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

  render() {
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
              <th>Transaction ID</th>
              <th>Member Name</th>
              <th>Game Name</th>
              <th>Date Issue</th>
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
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
