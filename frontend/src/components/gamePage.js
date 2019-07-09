import React, { Component } from "react";

class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id
    };
  }
  render() {
    return <div>Hello from Game Page {this.state.id}</div>;
  }
}

export default GamePage;
