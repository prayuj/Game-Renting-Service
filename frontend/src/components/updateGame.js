import React, { Component } from "react";
import axios from "axios";
import GameForm from "./gameForm";

import { Redirect } from "react-router-dom";
class UpdateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      name: "",
      description: "",
      items: [
        {
          console: "",
          id: 1,
          serial: "",
          mrp: "",
        },
      ],
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getGame();
  }

  onSubmit(e, count, items, old_items) {
    console.log(e.target, count, items, old_items);
    let temp_items = [];
    for (let i = 0; i < count; i++) {
      if (items[i].new === true) {
        console.log("We are in new block");
        let index = 4 * i + 2 + old_items.length * 4;
        let serial = e.target[index].value;
        let consol = e.target[index + 1].value;
        let mrp = e.target[index + 2].value;
        console.log(i);
        temp_items.push({
          console: consol,
          serial_no: serial,
          status: "Available",
          responsible: "Owner",
          mrp: mrp,
          description: "Test",
        });
      } else {
        console.log("We are in old block");
        temp_items.push(items[i]);
      }
    }

    for (let i = 0; i < old_items.length; i++) {
      temp_items.push(old_items[i]);
    }
    console.log(temp_items);

    const newGame = {
      _id: this.state.id,
      name: e.target.name.value,
      description: e.target.description.value,
      items: temp_items,
    };

    axios
      .post(this.props.url + "/game/update/" + this.state.id, newGame)
      .then((res) => {
        console.log(res.data);
        this.setRedirect();
      })
      .catch((err) => console.log(err));
  }

  getGame() {
    axios
      .get(this.props.url + "/game/" + this.state.id)
      .then((res) => {
        console.log(res.data);
        this.setState({
          name: res.data.name,
          description: res.data.description,
          items: res.data.items,
          count: res.data.items.length,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setRedirect = () => {
    console.log("Test");
    this.setState({
      redirect: true,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/game/" + this.state.id} />;
    }
  };

  render() {
    console.log(this.state);
    return (
      <div style={{ marginTop: 10 }}>
        {this.renderRedirect()}
        <h3>Update Game</h3>
        <GameForm
          handleForm={this.onSubmit}
          mode="update"
          name={this.state.name}
          description={this.state.description}
          items={this.state.items}
          count={this.state.count}
        />
      </div>
    );
  }

  //   name: nextProps.name,
  //         description: nextProps.description,
  //         items: nextProps.items,
  //         count: nextProps.count
}

export default UpdateGame;
