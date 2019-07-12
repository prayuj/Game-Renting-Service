import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: props._id,
      sr: props.sr,
      name: props.name,
      availableIn: props.availableIn,
      status: props.status,
      noAvailable: props.noAvailable,
      redirect: false
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
      return <Redirect push to={"/game/" + this.state._id} />;
    }
  };
  render() {
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
  }
}

export default Game;
