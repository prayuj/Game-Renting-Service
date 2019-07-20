import React, { Component } from "react";
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
  render() {
    return (
      <div>
        <div>
          Recently Added Customers
          <table className="table" style={{ marginTop: 20 }}>
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
        <div>Recently Issued Games</div>
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
        <div>Recently Returned Games</div>
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
      </div>
    );
  }
}

export default Dashboard;
