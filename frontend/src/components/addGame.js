import React, { Component } from "react";
import GameForm from "./gameForm";
import axios from "axios";

class AddGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game_name: "",
      game_description: "",
      game_properties: [
        {
          console: "",
          id: 1,
          serial: "",
          mrp: ""
        }
      ],
      count: 1
    };
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onAdd() {
    let temp_game_properties = this.state.game_properties;
    temp_game_properties.push({
      id: this.state.count + 1,
      serial: "",
      console: "",
      mrp: ""
    });
    console.log(temp_game_properties);
    this.setState({
      game_properties: temp_game_properties,
      count: this.state.count + 1
    });
  }

  onDelete(e) {
    console.log(e.target.id);
    let temp_game_properties = this.state.game_properties;
    console.log(temp_game_properties);
    for (let i = 0; i < temp_game_properties.length; i++) {
      console.log(temp_game_properties[i].id.toString() == e.target.id);
      if (temp_game_properties[i].id == e.target.id.toString()) {
        console.log("Found");
        temp_game_properties.splice(i, 1);
      }
    }
    console.log(temp_game_properties);
    this.setState({
      game_properties: temp_game_properties
    });
  }

  onSubmit(e, count, items) {
    console.log(e.target, count);
    console.log(`Form submitted:`);
    console.log(`Game Name: ${e.target.name.value}`);
    console.log(`Game Description: ${e.target.description.value}`);
    console.log("Game Properties");
    items = [];
    for (let i = 0; i < count; i++) {
      console.log("hello");
      let index = 4 * i + 2;
      let serial = e.target[index].value;
      let consol = e.target[index + 1].value;
      let mrp = e.target[index + 2].value;
      items.push({
        console: consol,
        serial_no: serial,
        status: "Available",
        responsible: "Owner",
        mrp: mrp,
        description: "Test"
      });

      console.log(items[i]);
    }

    const newGame = {
      name: e.target.name.value,
      description: e.target.description.value,
      items: items
    };

    axios
      .post("http://localhost:4000/game/add", newGame)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    this.setState({
      game_name: "",
      game_description: "",
      game_properties: [
        {
          console: "",
          id: 1,
          serial: "",
          console: "",
          mrp: ""
        }
      ],
      count: 1
    });
  }

  render() {
    let status = this.state.status;
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Add New Game</h3>
        <GameForm handleForm={this.onSubmit} mode="add" />
      </div>
    );
  }
}

export default AddGame;
