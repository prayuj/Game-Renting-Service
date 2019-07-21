import React, { Component } from "react";

import { Redirect } from "react-router-dom";

class Transaction extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      index: props.index,
      id: props.id,
      game_name: props.game_name,
      customer_name: props.customer_name,
      date_issue: props.date_issue,
      date_return: props.date_return
    };
  }

  setRedirect = () => {
    console.log("Test");
    this.setState({
      redirect: true
    });
  };

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      index: nextProps.index,
      id: nextProps.id,
      game_name: nextProps.game_name,
      customer_name: nextProps.customer_name,
      date_issue: nextProps.date_issue,
      date_return: nextProps.date_return
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/transaction/" + this.state.id} />;
    }
  };

  render() {
    return (
      <tr id={this.state._id} className="items" onClick={this.setRedirect}>
        {this.renderRedirect()}
        <td>{this.state.index}</td>
        <td>{this.state.id}</td>
        <td>{this.state.customer_name}</td>
        <td>{this.state.game_name}</td>
        <td>{this.state.date_issue}</td>
        <td>{this.state.date_return}</td>
      </tr>
    );
  }
}

export default Transaction;
