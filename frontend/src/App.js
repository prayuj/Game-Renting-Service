import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Dashboard from "./components/dashboard";
import Customers from "./components/customers";
import Games from "./components/games";
import Transactions from "./components/transactions";
import GamePage from "./components/gamePage";
import CustomerPage from "./components/customerPage";
import TransactionPage from "./components/transactionPage";
import AddGame from "./components/addGame";
import AddCustomer from "./components/addCustomer";
import UpdateCustomer from "./components/updateCustomer";
import AddPlan from "./components/addPlan";
import UpdateGame from "./components/updateGame";
import Issue from "./components/issue";
import Return from "./components/return";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    let currentPath = window.location.pathname;
    if (
      currentPath.match(/^\/customer/) ||
      currentPath === "/add_customer/" ||
      currentPath.match(/^\/update_customer/)
    ) {
      console.log("1");
      this.state = {
        active: "customers"
      };
    } else if (
      currentPath.match(/^\/game/) ||
      currentPath === "/add_game/" ||
      currentPath.match(/^\/update_game/)
    ) {
      console.log("2");
      this.state = {
        active: "games"
      };
    } else if (currentPath.match(/^\/transaction/)) {
      console.log("3");
      this.state = {
        active: "transactions"
      };
    } else if (currentPath.match(/^\/issue/)) {
      console.log("4");
      this.state = {
        active: "issue"
      };
    } else if (currentPath.match(/^\/return/)) {
      console.log("5");
      this.state = {
        active: "return"
      };
    } else {
      console.log("6");
      this.state = {
        active: "game_rent"
      };
    }
    this.onCickHandler = this.onCickHandler.bind(this);
  }

  onCickHandler(e) {
    console.log(e.target.id);
    if (e.target.id === "Home") {
      this.setState({
        active: "game_rent"
      });
    } else if (e.target.id === "Customers") {
      this.setState({
        active: "customers"
      });
    } else if (e.target.id === "Games") {
      this.setState({
        active: "games"
      });
    } else if (e.target.id === "Transactions") {
      this.setState({
        active: "transactions"
      });
    } else if (e.target.id === "Issue") {
      this.setState({
        active: "issue"
      });
    } else if (e.target.id === "Return") {
      this.setState({
        active: "return"
      });
    }
  }

  render() {
    return (
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav nav nav-pills mr-auto">
              <li className="navbar-item">
                <Link
                  to="/"
                  className={
                    this.state.active === "game_rent"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={this.onCickHandler}
                  id="Home"
                >
                  Game Rent
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/customers"
                  className={
                    this.state.active === "customers"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={this.onCickHandler}
                  id="Customers"
                >
                  Customers
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/games"
                  className={
                    this.state.active === "games"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={this.onCickHandler}
                  id="Games"
                >
                  Games
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/transactions"
                  className={
                    this.state.active === "transactions"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={this.onCickHandler}
                  id="Transactions"
                >
                  Transactions
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/issue/mode=dashboard&id=0"
                  className={
                    this.state.active === "issue"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={this.onCickHandler}
                  id="Issue"
                >
                  Issue
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/return/mode=dashboard&id=0"
                  className={
                    this.state.active === "return"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  onClick={this.onCickHandler}
                  id="Return"
                >
                  Return
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <Route path="/" exact component={Dashboard} />
        <Route path="/customers" component={Customers} />
        <Route path="/games" component={Games} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/game/:id" component={GamePage} />
        <Route path="/customer/:id" component={CustomerPage} />
        <Route path="/transaction/:id" component={TransactionPage} />
        <Route path="/add_game" component={AddGame} />
        <Route path="/add_customer" component={AddCustomer} />
        <Route path="/update_customer/:id" component={UpdateCustomer} />
        <Route path="/update_game/:id" component={UpdateGame} />
        <Route path="/add_plan/:id" component={AddPlan} />
        <Route path="/issue/mode=:mode&id=:id" component={Issue} />
        <Route path="/return/mode=:mode&id=:id" component={Return} />
      </Router>
    );
  }
}

export default App;
