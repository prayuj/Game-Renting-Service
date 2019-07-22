import React, { Component } from "react";
import Customer from "./customer";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      search: "",
      filtered: [],
      ascendingName: true,
      ascendingDOJ: true,
      ascendingMembershipEnd: true,
      nameSortButtonValue: "Sort",
      DOJSortButtonValue: "Sort",
      membershipEndSortButtonValue: "Sort"
    };
    this.getCustomers = this.getCustomers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClickForSort = this.onClickForSort.bind(this);
  }

  componentDidMount() {
    this.getCustomers();
  }

  getCustomers() {
    axios.get("http://localhost:4000/customer/").then(res => {
      this.setState({
        customers: res.data,
        filtered: res.data
      });
    });
  }

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    return today;
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/add_customer/"} />;
    }
  };

  handleChange(e) {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      console.log("HERE 1");
      // Assign the original list to currentList
      currentList = this.state.customers;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(item => {
        // change current item to lowercase
        const lc = item.name.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
      console.log(newList);
    } else {
      console.log("HERE 2");
      // If the search bar is empty, set newList to original task list
      newList = this.state.customers;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filtered: newList
    });
  }

  onClickForSort(e) {
    console.log(e.target.value);
    if (e.target.value === "Name") {
      let customers = this.state.filtered;
      customers.sort((a, b) => {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (this.state.ascendingName) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingName) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(customers);
      let arrow = this.state.ascendingName ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: customers,
        ascendingName: !this.state.ascendingName,
        nameSortButtonValue: arrow,
        DOJSortButtonValue: "Sort",
        membershipEndSortButtonValue: "Sort"
      });
    }
    if (e.target.value === "DOJ") {
      let customers = this.state.filtered;
      customers.sort((a, b) => {
        var x = a.dateOfJoin;
        var y = b.dateOfJoin;
        if (this.state.ascendingDOJ) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingDOJ) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(customers);
      let arrow = this.state.ascendingDOJ ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: customers,
        ascendingDOJ: !this.state.ascendingDOJ,
        DOJSortButtonValue: arrow,
        nameSortButtonValue: "Sort",
        membershipEndSortButtonValue: "Sort"
      });
    }
    if (e.target.value === "Membership") {
      let customers = this.state.filtered;
      customers.sort((a, b) => {
        var x = a.latestMembership.end;
        var y = b.latestMembership.end;
        if (this.state.ascendingMembershipEnd) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingMembershipEnd) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(customers);
      let arrow = this.state.ascendingMembershipEnd ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        filtered: customers,
        ascendingMembershipEnd: !this.state.ascendingMembershipEnd,
        membershipEndSortButtonValue: arrow,
        nameSortButtonValue: "Sort",
        DOJSortButtonValue: "Sort"
      });
    }
  }

  render() {
    console.log(this.state.filtered);
    return (
      <div>
        {this.renderRedirect()}
        <input
          type="button"
          className="btn btn-primary"
          value="Add Customer"
          onClick={this.setRedirect}
        />
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
                Name
                <button
                  className="btn btn-primary"
                  value="Name"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.nameSortButtonValue}
                </button>
              </th>
              <th>Email-ID</th>
              <th>
                Date Of Joining
                <button
                  className="btn btn-primary"
                  value="DOJ"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.DOJSortButtonValue}
                </button>
              </th>
              <th>
                Membership Expiry
                <button
                  className="btn btn-primary"
                  value="Membership"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.membershipEndSortButtonValue}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.filtered.map((filter, index) => (
              <Customer
                mode="customers"
                id={filter._id}
                sr={index + 1}
                name={filter.name}
                email={filter.email}
                dateOfJoin={this.convertDate(filter.dateOfJoin)}
                dateOfMembershipEnd={
                  filter.latestMembership.active
                    ? this.convertDate(filter.latestMembership.end)
                    : "Expired Membership"
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Customers;
