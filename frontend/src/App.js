import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
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
    console.log(localStorage.isLoggedIn);
    let isLoggedIn = false;
    if (localStorage.isLoggedIn) isLoggedIn = localStorage.isLoggedIn;
    let currentPath = window.location.pathname;
    if (
      currentPath.match(/^\/customer/) ||
      currentPath === "/add_customer/" ||
      currentPath.match(/^\/update_customer/)
    ) {
      console.log("1");
      this.state = {
        active: "customers",
        isLoggedIn: isLoggedIn
      };
    } else if (
      currentPath.match(/^\/game/) ||
      currentPath === "/add_game/" ||
      currentPath.match(/^\/update_game/)
    ) {
      console.log("2");
      this.state = {
        active: "games",
        isLoggedIn: isLoggedIn
      };
    } else if (currentPath.match(/^\/transaction/)) {
      console.log("3");
      this.state = {
        active: "transactions",
        isLoggedIn: isLoggedIn
      };
    } else if (currentPath.match(/^\/issue/)) {
      console.log("4");
      this.state = {
        active: "issue",
        isLoggedIn: isLoggedIn
      };
    } else if (currentPath.match(/^\/return/)) {
      console.log("5");
      this.state = {
        active: "return",
        isLoggedIn: isLoggedIn
      };
    } else {
      console.log("6");
      this.state = {
        active: "dashboard",
        isLoggedIn: isLoggedIn
      };
    }
    this.onCickHandler = this.onCickHandler.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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

  handleLogin(state) {
    axios.post("http://localhost:4000/login/", state).then(res => {
      this.setState({
        isLoggedIn: res.data.isLoggedIn
      });
      localStorage.setItem("isLoggedIn", res.data.isLoggedIn);
      if (!res.data.isLoggedIn) {
        alert("Wrong Password");
      }
    });
  }

  handleLogout() {
    this.setState({
      isLoggedIn: false
    });

    localStorage.setItem("isLoggedIn", false);
  }

  render() {
    console.log(this.state);
    if (this.state.isLoggedIn)
      return (
        <Router>
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
          <br />
          <Switch>
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
            <Route component={NotFound} />
          </Switch>
        </Router>
      );
    else return <Login handleForm={this.handleLogin} />;
  }
}

export default App;
