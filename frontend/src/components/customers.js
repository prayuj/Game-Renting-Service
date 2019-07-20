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
      filtered: []
    };
    this.getCustomers = this.getCustomers.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
              <th>Name</th>
              <th>Email-ID</th>
              <th>Membership start</th>
              <th>Membership end</th>
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
                membershipEndDate={this.convertDate(filter.membershipEndDate)}
                membershipJoinDate={this.convertDate(
                  filter.membershipStartDate
                )}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Customers;
