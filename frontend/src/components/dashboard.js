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
      search: "",
      todayCustomer: 0,
      todayMembershipEnding: 0,
      todayIssued: 0,
      todayReturn: 0
    };
    this.getDetails = this.getDetails.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.getIssuedGames = this.getIssuedGames.bind(this);
    this.getReturnedGames = this.getReturnedGames.bind(this);
  }

  componentDidMount() {
    this.getDetails();
    this.getCustomers();
    this.getIssuedGames();
    this.getReturnedGames();
  }

  getDetails() {
    axios.get("http://localhost:4000/customer/todayCustomer").then(res => {
      this.setState({
        todayCustomer: res.data.todayCustomer
      });
    });

    axios
      .get("http://localhost:4000/customer/todayMembershipEnding")
      .then(res => {
        this.setState({
          todayMembershipEnding: res.data.todayMembershipEnding
        });
      });

    axios.get("http://localhost:4000/game/todayIssued").then(res => {
      this.setState({
        todayIssued: res.data.todayIssued
      });
    });

    axios.get("http://localhost:4000/game/todayReturn").then(res => {
      this.setState({
        todayReturn: res.data.todayReturn
      });
    });
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
        <span>
          <h4>Customers Added Today:{this.state.todayCustomer}</h4>
          <h4>
            Customers Membership Ending Today:{this.state.todayMembershipEnding}
          </h4>
          <h4>Games Issued Today:{this.state.todayIssued}</h4>
          <h4>Games Returned Today:{this.state.todayReturn}</h4>
        </span>
        <hr />
        <br />
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
          <h3>Membership Ending Soon</h3>
          <table className="table" style={{ marginTop: 20, padding: "2px" }}>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Name</th>
                <th>Email-ID</th>
                <th>Date Ending</th>
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
                  dateEnding={this.convertDate(customer.latestMembership.end)}
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
