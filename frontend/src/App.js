import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  useLocation,
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
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

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
        showNavbar: showNavbar,
      };
    } else if (
      currentPath.match(/^\/game/) ||
      currentPath === "/add_game/" ||
      currentPath.match(/^\/update_game/)
    ) {
      console.log("2");
      this.state = {
        active: "games",
        showNavbar: showNavbar,
      };
    } else if (currentPath.match(/^\/transaction/)) {
      console.log("3");
      this.state = {
        active: "transactions",
        showNavbar: showNavbar,
      };
    } else if (currentPath.match(/^\/issue/)) {
      console.log("4");
      this.state = {
        active: "issue",
        showNavbar: showNavbar,
      };
    } else if (currentPath.match(/^\/return/)) {
      console.log("5");
      this.state = {
        active: "return",
        showNavbar: showNavbar,
      };
    } else {
      console.log("6");
      this.state = {
        active: "dashboard",
        showNavbar: showNavbar,
      };
    }
    this.state.expanded = false;
    this.onCickHandler = this.onCickHandler.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLoginInApp = this.handleLoginInApp.bind(this);
  }

  componentDidMount() {
    console.log(window.location.pathname);
  }

  componentDidUpdate() {
    console.log(window.location.pathname);
  }

  onCickHandler(e) {
    console.log(e.target);
    if (e.target.id === "Home") {
      this.setState({
        active: "dashboard",
      });
    } else if (e.target.id === "Customers") {
      this.setState({
        active: "customers",
      });
    } else if (e.target.id === "Games") {
      this.setState({
        active: "games",
      });
    } else if (e.target.id === "Transactions") {
      this.setState({
        active: "transactions",
      });
    } else if (e.target.id === "Issue") {
      this.setState({
        active: "issue",
      });
    } else if (e.target.id === "Return") {
      this.setState({
        active: "return",
      });
    }
  }

  handleLogout() {
    localStorage.removeItem("isLoggedIn");
    this.setState({
      showNavbar: false,
    });
  }

  handleLoginInApp() {
    this.setState({
      showNavbar: true,
    });
  }

  render() {
    return (
      <Router basename="/">
        {this.state.showNavbar ? (
          <>
            <Navbar
              expand="lg"
              variant="dark"
              onSelect={(e) => {
                this.setState({ expanded: false, active: e });
              }}
              expanded={this.state.expanded}
            >
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                onClick={() =>
                  this.setState({ expanded: !this.state.expanded })
                }
              />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link
                    as={Link}
                    to="/"
                    eventKey="dashboard"
                    active={this.state.active === "dashboard"}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    to="/customers"
                    as={Link}
                    eventKey="customers"
                    active={this.state.active === "customers"}
                  >
                    Customers
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/games"
                    eventKey="games"
                    active={this.state.active === "games"}
                  >
                    Games
                  </Nav.Link>
                  <Nav.Link
                    to="/transactions"
                    as={Link}
                    eventKey="transactions"
                    active={this.state.active === "transactions"}
                  >
                    Transactions
                  </Nav.Link>
                  <Nav.Link
                    to="/issue/mode=dashboard&id=0"
                    as={Link}
                    eventKey="issue"
                    active={this.state.active === "issue"}
                  >
                    Issue
                  </Nav.Link>
                  <Nav.Link
                    to="/return/mode=dashboard&id=all"
                    as={Link}
                    eventKey="return"
                    active={this.state.active === "return"}
                  >
                    Return
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link onClick={this.handleLogout} eventKey="logout">
                    Logout
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            {/* <nav className="navbar navbar-expand-lg navbar-dark">
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
           */}
          </>
        ) : (
          <Login onSubmit={this.handleLoginInApp} />
        )}
        <Switch>
          <PrivateRoute
            path="/"
            exact
            component={Dashboard}
            url={this.props.url}
          />
          <Route
            path="/login"
            render={() => {
              if (this.state.showNavbar) return <Redirect to="/" />;
              else console.log("Hello");
            }}
            url={this.props.url}
          />
          <PrivateRoute
            path="/customers"
            component={Customers}
            url={this.props.url}
          />
          <PrivateRoute path="/games" component={Games} url={this.props.url} />
          <PrivateRoute
            path="/transactions"
            component={Transactions}
            url={this.props.url}
          />
          <PrivateRoute
            path="/game/:id"
            component={GamePage}
            url={this.props.url}
          />
          <PrivateRoute
            path="/customer/:id"
            component={CustomerPage}
            url={this.props.url}
          />
          <PrivateRoute
            path="/transaction/:id"
            component={TransactionPage}
            url={this.props.url}
          />
          <PrivateRoute
            path="/add_game"
            component={AddGame}
            url={this.props.url}
          />
          <PrivateRoute
            path="/add_customer"
            component={AddCustomer}
            url={this.props.url}
          />
          <PrivateRoute
            path="/update_customer/:id"
            component={UpdateCustomer}
            url={this.props.url}
          />
          <PrivateRoute
            path="/update_game/:id"
            component={UpdateGame}
            url={this.props.url}
          />
          <PrivateRoute
            path="/add_plan/:id"
            component={AddPlan}
            url={this.props.url}
          />
          <PrivateRoute
            path="/issue/mode=:mode&id=:id"
            component={Issue}
            url={this.props.url}
          />
          <PrivateRoute
            path="/return/mode=:mode&id=:id"
            component={Return}
            url={this.props.url}
          />
          <PrivateRoute component={NotFound} url={this.props.url} />
        </Switch>
      </Router>
    );
  }
}

export default App;
