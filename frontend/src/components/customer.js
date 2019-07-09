import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      email: props.email,
      membershipJoinDate: props.membershipJoinDate,
      membershipEndDate: props.membershipEndDate
    };

    this.setRedirect = this.setRedirect.bind(this);
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
    return (
      <tr onClick={this.setRedirect} id={this.state.id} className="items">
        {this.renderRedirect()}
        <td>{this.state.id}</td>
        <td>{this.state.name}</td>
        <td>{this.state.email}</td>
        <td>{this.state.membershipJoinDate}</td>
        <td>{this.state.membershipJoinDate}</td>
      </tr>
    );
  }
}

export default Customer;
