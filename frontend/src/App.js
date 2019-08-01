import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./components/login";
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
import NotFound from "./components/notFound";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    let showNavbar = false;
    if (localStorage.getItem("isLoggedIn")) showNavbar = true;
    let currentPath = window.location.pathname;
    if (
      currentPath.match(/^\/customer/) ||
      currentPath === "/add_customer/" ||
      currentPath.match(/^\/update_customer/)
    ) {
      console.log("1");
      this.state = {
        active: "customers",
        showNavbar: showNavbar
      };
    } else if (
      currentPath.match(/^\/game/) ||
      currentPath === "/add_game/" ||
      currentPath.match(/^\/update_game/)
    ) {
      console.log("2");
      this.state = {
        active: "games",
        showNavbar: showNavbar
      };
    } else if (currentPath.match(/^\/transaction/)) {
      console.log("3");
      this.state = {
        active: "transactions",
        showNavbar: showNavbar
      };
    } else if (currentPath.match(/^\/issue/)) {
      console.log("4");
      this.state = {
        active: "issue",
        showNavbar: showNavbar
      };
    } else if (currentPath.match(/^\/return/)) {
      console.log("5");
      this.state = {
        active: "return",
        showNavbar: showNavbar
      };
    } else {
      console.log("6");
      this.state = {
        active: "dashboard",
        showNavbar: showNavbar
      };
    }
    this.onCickHandler = this.onCickHandler.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLoginInApp = this.handleLoginInApp.bind(this);
  }

  componentDidUpdate() {
    console.log(window.location.pathname);
  }

  onCickHandler(e) {
    console.log(e.target.id);
    if (e.target.id === "Home") {
      this.setState({
        active: "dashboard"
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

  handleLogout() {
    localStorage.removeItem("isLoggedIn");
    this.setState({
      showNavbar: false
    });
  }

  handleLoginInApp() {
    this.setState({
      showNavbar: true
    });
  }

  render() {
    return (
      <Router>
        {this.state.showNavbar ? (
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav nav nav-pills mr-auto">
                <li className="navbar-item">
                  <Link
                    to="/"
                    className={
                      this.state.active === "dashboard"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={this.onCickHandler}
                    id="Home"
                  >
                    Dashboard
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
                    to="/return/mode=dashboard&id=all"
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
              <div class="navbar-collapse">
                <ul class="navbar-nav ml-auto">
                  <li class="nav-item">
                    <Link className="nav-link" onClick={this.handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        ) : (
          <Login onSubmit={this.handleLoginInApp} />
        )}
        <Switch>
          <PrivateRoute path="/" exact component={Dashboard} />
          <Route
            path="/login"
            render={() => {
              if (this.state.showNavbar) return <Redirect to="/" />;
              else console.log("Hello");
            }}
          />
          <PrivateRoute path="/customers" component={Customers} />
          <PrivateRoute path="/games" component={Games} />
          <PrivateRoute path="/transactions" component={Transactions} />
          <PrivateRoute path="/game/:id" component={GamePage} />
          <PrivateRoute path="/customer/:id" component={CustomerPage} />
          <PrivateRoute path="/transaction/:id" component={TransactionPage} />
          <PrivateRoute path="/add_game" component={AddGame} />
          <PrivateRoute path="/add_customer" component={AddCustomer} />
          <PrivateRoute
            path="/update_customer/:id"
            component={UpdateCustomer}
          />
          <PrivateRoute path="/update_game/:id" component={UpdateGame} />
          <PrivateRoute path="/add_plan/:id" component={AddPlan} />
          <PrivateRoute path="/issue/mode=:mode&id=:id" component={Issue} />
          <PrivateRoute path="/return/mode=:mode&id=:id" component={Return} />
          <PrivateRoute component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
