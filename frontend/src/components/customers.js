import React, { Component } from "react";
import Customer from "./customer";
import axios from "axios";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
    this.getTodos = this.getTodos.bind(this);
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios.get("http://localhost:4000/customer/").then(res => {
      this.setState({
        customers: res.data
      });
    });
  }

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    console.log(today);
    return today;
  }
  render() {
    console.log(this.state.customers);
    return (
      <div>
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
            {this.state.customers.map((customer, index) => (
              <Customer
                id={customer._id}
                sr={index + 1}
                name={customer.name}
                email={customer.email}
                membershipEndDate={this.convertDate(customer.membership[0].end)}
                membershipJoinDate={this.convertDate(
                  customer.membership[0].start
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
