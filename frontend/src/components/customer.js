import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Customer extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    if (props.mode == "customers")
      this.state = {
        display: "customers",
        id: props.id,
        sr: props.sr,
        name: props.name,
        email: props.email,
        membershipJoinDate: props.membershipJoinDate,
        membershipEndDate: props.membershipEndDate
      };
    if (props.mode == "dashboard")
      this.state = {
        display: "dashboard",
        id: props.id,
        sr: props.sr,
        name: props.name,
        email: props.email,
        dateOfJoin: props.dateOfJoin
      };
    this.setRedirect = this.setRedirect.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log(nextProps.mode.display);
    if (nextProps.mode.display == "customers")
      this.setState({
        display: "customers",
        id: nextProps.id,
        sr: nextProps.sr,
        name: nextProps.name,
        email: nextProps.email,
        membershipJoinDate: nextProps.membershipJoinDate,
        membershipEndDate: nextProps.membershipEndDate
      });

    if (nextProps.mode.display == "dashboard")
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
    console.log("Test");
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/customer/" + this.state.id} />;
    }
  };
  render() {
    if (this.state.display === "customers")
      return (
        <tr onClick={this.setRedirect} id={this.state.id} className="items">
          {this.renderRedirect()}
          <td>{this.state.sr}</td>
          <td>{this.state.name}</td>
          <td>{this.state.email}</td>
          <td>{this.state.membershipJoinDate}</td>
          <td>{this.state.membershipEndDate}</td>
        </tr>
      );
    if (this.state.display === "dashboard")
      return (
        <tr onClick={this.setRedirect} id={this.state.id} className="items">
          {this.renderRedirect()}
          <td>{this.state.sr}</td>
          <td>{this.state.name}</td>
          <td>{this.state.email}</td>
          <td>{this.state.dateOfJoin}</td>
        </tr>
      );
  }
}

export default Customer;
