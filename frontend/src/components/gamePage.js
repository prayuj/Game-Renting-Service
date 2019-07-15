import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      data: ""
    };
  }

  componentDidMount() {
    this.getGameDetail();
  }

  getGameDetail() {
    axios
      .get("http://localhost:4000/game/" + this.state.id)
      .then(res => {
        console.log(res.data, this.state.id);
        this.setState({
          data: res.data
        });
      })
      .catch(err => console.log(err));
  }

  setRedirect = e => {
    console.log(e.target.value);
    if (e.target.value === "Update")
      this.setState({
        redirect_to_update: true
      });
    else
      this.setState({
        redirect_to_add_plan: true
      });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_update) {
      return <Redirect push to={"/update_game/" + this.state.id} />;
    }
  };
  render() {
    console.log(this.state.data);
    let items = this.state.data.items ? (
      <div>
        {this.state.data.items.map(item => (
          <div>
            <span>{item.console}</span>
            <span>{item.serial_no}</span>
            <span>{item.status}</span>
            <span>{item.responsible}</span>
            <span>{item.description}</span>
            <span>{item.mrp}</span>
          </div>
        ))}
      </div>
    ) : (
      <div />
    );
    return (
      <div>
        {this.renderRedirect()}
        <input
          type="button"
          onClick={this.setRedirect}
          className="btn btn-primary"
          value="Update"
        />
        <div>{this.state.data.name}</div>
        <div>{this.state.data.description}</div>
        {items}
      </div>
    );
  }
}

export default GamePage;
