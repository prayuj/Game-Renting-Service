import React, { Component } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import axios from "axios";
import Customer from "./customer";
import Game from "./game";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      issue_game: [],
      return_game: [],
      search: ""
    };
    this.getCustomers = this.getCustomers.bind(this);
    this.getIssuedGames = this.getIssuedGames.bind(this);
    this.getReturnedGames = this.getReturnedGames.bind(this);
  }

  componentDidMount() {
    this.getCustomers();
    this.getIssuedGames();
    this.getReturnedGames();
  }

  getCustomers() {
    axios.get("http://localhost:4000/customer/dashboard").then(res => {
      this.setState({
        customers: res.data
      });
    });
  }

  getIssuedGames() {
    axios.get("http://localhost:4000/game/dashboard/issue").then(res => {
      console.log(res.data);
      this.setState({
        issue_game: res.data
      });
    });
  }

  getReturnedGames() {
    axios.get("http://localhost:4000/game/dashboard/return").then(res => {
      console.log(res.data);
      this.setState({
        return_game: res.data
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

  getToday() {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    console.log(yyyy + "-" + mm + "-" + dd);
    return yyyy + "-" + mm + "-" + dd;
  }
  render() {
    return (
      <div>
        <h3>Recently Issued Games</h3>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Name</th>
              <th>Issued To</th>
              <th>Date Of Issue</th>
            </tr>
          </thead>
          <tbody>
            {this.state.issue_game.map((game, index) => (
              <Game
                mode="issue"
                _id={game._id}
                sr={index + 1}
                name={game.gameInfo.name}
                cust_name={game.customerInfo.name}
                dateIssue={this.convertDate(game.date_issue)}
              />
            ))}
          </tbody>
        </table>
        <hr />
        <br />
        <h3>Recently Returned Games</h3>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Name</th>
              <th>Returned By</th>
              <th>Date Of Issue</th>
              <th>Date Of Return</th>
            </tr>
          </thead>
          <tbody>
            {this.state.return_game.map((game, index) => (
              <Game
                mode="return"
                _id={game._id}
                sr={index + 1}
                name={game.gameInfo.name}
                cust_name={game.customerInfo.name}
                dateIssue={this.convertDate(game.date_issue)}
                dateReturn={this.convertDate(game.date_return)}
              />
            ))}
          </tbody>
        </table>
        <hr />
        <br />
        <div>
          <h3>Recently Added Customers</h3>
          <table className="table" style={{ marginTop: 20, padding: "2px" }}>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Name</th>
                <th>Email-ID</th>
                <th>Date Of Join</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map((customer, index) => (
                <Customer
                  mode="dashboard"
                  id={customer._id}
                  sr={index + 1}
                  name={customer.name}
                  email={customer.email}
                  dateOfJoin={this.convertDate(customer.dateOfJoin)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
