import React, { Component } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import axios from "axios";
import Customer from "./customer";
import Game from "./game";
import loadingSpinner from "./loadingSpinner";
import LoadingSpinner from "./loadingSpinner";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      issue_game: [],
      return_game: [],
      search: "",
      dateFrom: "",
      dateTo: "",
      CustomersAdded: 0,
      MembershipEnding: 0,
      GamesIssued: 0,
      GamesReturn: 0,
      message: "Today",
      issue_game_loaded: false,
      return_game_loaded: false,
      customers_loaded: false,
    };
    this.getDetails = this.getDetails.bind(this);
    this.getCustomers = this.getCustomers.bind(this);
    this.getIssuedGames = this.getIssuedGames.bind(this);
    this.getReturnedGames = this.getReturnedGames.bind(this);
    this.getDashboardDetails = this.getDashboardDetails.bind(this);
  }

  componentDidMount() {
    this.getDetails();
    this.getCustomers();
    this.getIssuedGames();
    this.getReturnedGames();
  }

  getDetails() {
    axios
      .get(
        this.props.url +
          "/customer/CustomersAdded/from=" +
          this.getToday() +
          "&to=" +
          this.getToday()
      )
      .then((res) => {
        this.setState({
          CustomersAdded: res.data.CustomersAdded,
        });
      });

    axios
      .get(
        this.props.url +
          "/customer/MembershipEnding/from=" +
          this.getToday() +
          "&to=" +
          this.getToday()
      )
      .then((res) => {
        this.setState({
          MembershipEnding: res.data.MembershipEnding,
        });
      });

    axios
      .get(
        this.props.url +
          "/game/GamesIssued/from=" +
          this.getToday() +
          "&to=" +
          this.getToday()
      )
      .then((res) => {
        this.setState({
          GamesIssued: res.data.GamesIssued,
        });
      });

    axios
      .get(
        this.props.url +
          "/game/GamesReturn/from=" +
          this.getToday() +
          "&to=" +
          this.getToday()
      )
      .then((res) => {
        this.setState({
          GamesReturn: res.data.GamesReturn,
        });
      });
  }

  getCustomers() {
    axios.get(this.props.url + "/customer/dashboard").then((res) => {
      this.setState({
        customers: res.data,
        customers_loaded: true,
      });
    });
  }

  getIssuedGames() {
    axios.get(this.props.url + "/game/dashboard/issue").then((res) => {
      console.log(res.data);
      this.setState({
        issue_game: res.data,
        issue_game_loaded: true,
      });
    });
  }

  getReturnedGames() {
    axios.get(this.props.url + "/game/dashboard/return").then((res) => {
      console.log(res.data);
      this.setState({
        return_game: res.data,
        return_game_loaded: true,
      });
    });
  }

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = parseInt(date.getMonth()); //January is 0!
    var yyyy = date.getFullYear();
    var month_names = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var today = dd + "/" + month_names[mm] + "/" + yyyy;
    console.log(today);
    return today;
  }
  getToday() {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  getDashboardDetails(e) {
    e.preventDefault();
    if (e.target.from.value !== "" && e.target.to.value !== "") {
      axios
        .get(
          this.props.url +
            "/customer/CustomersAdded/from=" +
            e.target.from.value +
            "&to=" +
            e.target.to.value
        )
        .then((res) => {
          this.setState({
            CustomersAdded: res.data.CustomersAdded,
          });
        });

      axios
        .get(
          this.props.url +
            "/customer/MembershipEnding/from=" +
            e.target.from.value +
            "&to=" +
            e.target.to.value
        )
        .then((res) => {
          this.setState({
            MembershipEnding: res.data.MembershipEnding,
          });
        });

      axios
        .get(
          this.props.url +
            "/game/GamesIssued/from=" +
            e.target.from.value +
            "&to=" +
            e.target.to.value
        )
        .then((res) => {
          this.setState({
            GamesIssued: res.data.GamesIssued,
          });
        });

      axios
        .get(
          this.props.url +
            "/game/GamesReturn/from=" +
            e.target.from.value +
            "&to=" +
            e.target.to.value
        )
        .then((res) => {
          this.setState({
            GamesReturn: res.data.GamesReturn,
          });
        });
      if (this.state.dateFrom === this.state.dateTo)
        if (this.state.dateFrom === this.getToday()) {
          this.setState({
            message: "Today",
          });
        } else {
          this.setState({
            message: "on " + this.convertDate(this.state.dateTo) + " ",
          });
        }
      else
        this.setState({
          message:
            "from " +
            this.convertDate(this.state.dateFrom) +
            " to " +
            this.convertDate(this.state.dateTo) +
            " ",
        });
    }
  }

  render() {
    let message = "today";
    if (this.state.dateFrom != "" && this.state.dateTo != "") {
      if (this.state.dateFrom === this.state.dateTo)
        message = "on " + this.convertDate(this.state.dateTo) + " ";
      else
        message =
          "from " +
          this.convertDate(this.state.dateFrom) +
          " to " +
          this.convertDate(this.state.dateTo) +
          " ";
    }

    return (
      <div>
        <div>
          <form onSubmit={this.getDashboardDetails}>
            Select Dates
            <input
              name="from"
              type="date"
              value={this.state.dateFrom}
              max={this.getToday()}
              onChange={(e) => this.setState({ dateFrom: e.target.value })}
            />
            to
            <input
              name="to"
              type="date"
              value={this.state.dateTo}
              min={this.state.dateFrom}
              max={this.getToday()}
              onChange={(e) => this.setState({ dateTo: e.target.value })}
            />
            <input type="submit" className="btn btn-info" value="Get" />
          </form>
          <h4>
            {this.state.CustomersAdded + " "}
            Customers Added {this.state.message}
          </h4>
          <h4>
            {this.state.MembershipEnding + " "}
            Customers Membership Ending {this.state.message}
          </h4>
          <h4>
            {this.state.GamesIssued + " "}
            Games Issued {this.state.message}
          </h4>
          <h4>
            {this.state.GamesReturn + " "}
            Games Returned {this.state.message}
          </h4>
        </div>
        <hr />
        <br />
        <h3>Recently Issued Games</h3>
        <div className="table-responsive-xl">
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
              {this.state.issue_game_loaded ? (
                this.state.issue_game.map((game, index) => (
                  <Game
                    mode="issue"
                    _id={game._id}
                    sr={index + 1}
                    name={game.gameInfo.name}
                    cust_name={game.customerInfo.name}
                    dateIssue={this.convertDate(game.date_issue)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{ position: "relative", top: "50%", left: "50%" }}
                  >
                    <LoadingSpinner></LoadingSpinner>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <hr />
        <br />
        <h3>Recently Returned Games</h3>
        <div className="table-responsive-xl">
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
              {this.state.return_game_loaded ? (
                this.state.return_game.map((game, index) => (
                  <Game
                    mode="return"
                    _id={game._id}
                    sr={index + 1}
                    name={game.gameInfo.name}
                    cust_name={game.customerInfo.name}
                    dateIssue={this.convertDate(game.date_issue)}
                    dateReturn={this.convertDate(game.date_return)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ position: "relative", top: "50%", left: "50%" }}
                  >
                    <LoadingSpinner></LoadingSpinner>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <hr />
        <br />
        <div>
          <h3>Membership Ending Soon</h3>
          <div className="table-responsive-xl">
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
                {this.state.customers_loaded ? (
                  this.state.customers.map((customer, index) => (
                    <Customer
                      mode="dashboard"
                      id={customer._id}
                      sr={index + 1}
                      name={customer.name}
                      email={customer.email}
                      dateEnding={this.convertDate(
                        customer.latestMembership.end
                      )}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ position: "relative", top: "50%", left: "50%" }}
                    >
                      <LoadingSpinner></LoadingSpinner>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
