import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Games from "./games";

class Game extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    if (props.mode == "games")
      this.state = {
        mode: "games",
        _id: props._id,
        sr: props.sr,
        name: props.name,
        availableIn: props.availableIn,
        status: props.status,
        noAvailable: props.noAvailable,
        redirect: false
      };
    if (props.mode == "issue")
      this.state = {
        mode: "issue",
        _id: props._id,
        cust_name: props.cust_name,
        sr: props.sr,
        name: props.name,
        dateIssue: props.dateIssue,
        redirect: false
      };

    if (props.mode == "return")
      this.state = {
        mode: "return",
        _id: props._id,
        sr: props.sr,
        name: props.name,
        cust_name: props.cust_name,
        dateIssue: props.dateIssue,
        dateReturn: props.dateReturn,
        redirect: false
      };

    this.setRedirect = this.setRedirect.bind(this);
  }
  componentWillReceiveProps(nextProps, nextState) {
    console.log(nextProps.mode.display);
    if (nextProps.mode == "games")
      this.setState({
        mode: "games",
        _id: nextProps._id,
        sr: nextProps.sr,
        name: nextProps.name,
        availableIn: nextProps.availableIn,
        status: nextProps.status,
        noAvailable: nextProps.noAvailable,
        redirect: false
      });

    if (nextProps.mode == "dashboard")
      this.setState({
        display: "dashboard",
        id: nextProps.id,
        sr: nextProps.sr,
        name: nextProps.name,
        email: nextProps.email,
        dateOfJoin: nextProps.dateOfJoin
      });
  }

  setRedirect = () => {
    if (this.state.mode === "games")
      this.setState({
        redirect_to_game: true
      });
    else if (this.state.mode === "issue" || this.state.mode === "return")
      this.setState({
        redirect_to_transaction: true
      });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_game) {
      return <Redirect push to={"/game/" + this.state._id} />;
    }
    if (this.state.redirect_to_transaction) {
      return <Redirect push to={"/transaction/" + this.state._id} />;
    }
  };
  render() {
    if (this.state.mode === "games")
      return (
        <tr onClick={this.setRedirect} id={this.state._id} className="items">
          {this.renderRedirect()}
          <td>{this.state.sr}</td>
          <td>{this.state.name}</td>
          <td>
            {this.state.availableIn.map(gameingConsole => gameingConsole + " ")}
          </td>
          <td>{this.state.noAvailable}</td>
        </tr>
      );
    if (this.state.mode === "issue")
      return (
        <tr onClick={this.setRedirect} id={this.state._id} className="items">
          {this.renderRedirect()}
          <td>{this.state.sr}</td>
          <td>{this.state.name}</td>
          <td>{this.state.cust_name}</td>
          <td>{this.state.dateIssue}</td>
        </tr>
      );
    if (this.state.mode === "return")
      return (
        <tr onClick={this.setRedirect} id={this.state._id} className="items">
          {this.renderRedirect()}
          <td>{this.state.sr}</td>
          <td>{this.state.name}</td>
          <td>{this.state.cust_name}</td>
          <td>{this.state.dateIssue}</td>
          <td>{this.state.dateReturn}</td>
        </tr>
      );
  }
}

export default Game;
