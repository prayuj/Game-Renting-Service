import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Dashboard from "./components/dashboard";
import Customers from "./components/customers";
import Games from "./components/games";
import GamePage from "./components/gamePage";
import CustomerPage from "./components/customerPage";
import AddGame from "./components/addGame";
import AddCustomer from "./components/addCustomer";
import UpdateCustomer from "./components/updateCustomer";
import AddPlan from "./components/addPlan";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/" className="brand">
          Game Rent
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/customers" className="nav-link">
                Customers
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/games" className="nav-link">
                Games
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <br />
      <Route path="/" exact component={Dashboard} />
      <Route path="/customers" component={Customers} />
      <Route path="/games" component={Games} />
      <Route path="/game/:id" component={GamePage} />
      <Route path="/customer/:id" component={CustomerPage} />
      <Route path="/add_game" component={AddGame} />
      <Route path="/add_customer" component={AddCustomer} />
      <Route path="/update_customer/:id" component={UpdateCustomer} />
      <Route path="/add_plan/:id" component={AddPlan} />
    </Router>
  );
}

export default App;
