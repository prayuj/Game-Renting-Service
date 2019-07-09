import React, { Component } from "react";

class CustomerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id
    };
  }
  render() {
    return <div>Hello from Customer Page {this.state.id}</div>;
  }
}

export default CustomerPage;
