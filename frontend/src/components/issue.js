import React, { Component } from "react";

class Issue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id
    };
    this.handleForm = this.handleForm.bind(this);
  }

  handleForm(e) {}
  render() {
    return (
      <div>
        <form onClick={this.handleForm}>
          <label>Game ID</label>
          <input name="game" className="form-control" placeholder="Game ID" />
          <label>Console</label>
          <select className="form-control" name="console">
            <option>Choose a console</option>
            <option>PS4</option>
            <option>XBOX One</option>
          </select>
        </form>
      </div>
    );
  }
}

export default Issue;
