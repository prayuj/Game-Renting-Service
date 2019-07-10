import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class AddGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game_name: "",
      game_description: "",
      game_properties: [
        {
          id: 1,
          serial: "",
          console: "",
          mrp: ""
        }
      ],
      count: 1
    };
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChangeGameDescription = this.onChangeGameDescription.bind(this);
    this.onChangeGameName = this.onChangeGameName.bind(this);
    this.onChangeGameMRP = this.onChangeGameMRP.bind(this);
    this.onChangePS4 = this.onChangePS4.bind(this);
    this.onCounterPS4 = this.onCounterPS4.bind(this);
    this.onChangeXBOX = this.onChangeXBOX.bind(this);
    this.onCounterXBOX = this.onCounterXBOX.bind(this);
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

  onChangeGameDescription(e) {
    this.setState({
      game_description: e.target.value
    });
  }

  onChangeGameName(e) {
    this.setState({
      game_name: e.target.value
    });
  }

  onChangeGameMRP(e) {
    this.setState({
      game_MRP: e.target.value
    });
  }

  onChangePS4(e) {
    this.setState({
      game_ps4: !this.state.game_ps4
    });
  }

  onChangeXBOX(e) {
    this.setState({
      game_xbox: !this.state.game_xbox
    });
  }

  onCounterPS4(e) {
    this.setState({
      no_ps4: this.state.no_ps4 + 1
    });
    console.log(this.state.no_ps4);
  }

  onCounterXBOX(e) {
    this.setState({
      no_ps4: this.state.no_xbox + 1
    });
    console.log(this.state.no_xbox);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(e.target[2].value);
    console.log(`Form submitted:`);
    console.log(`Game Name: ${e.target.name.value}`);
    console.log(`Game Description: ${e.target.description.value}`);
    console.log("Game Properties");
    let temp_game_properties = this.state.game_properties;
    for (let i = 0; i < temp_game_properties.length; i++) {
      console.log("hello");
      let index = 4 * i + 2;
      temp_game_properties[i].id = i + 1;
      temp_game_properties[i].serial = e.target[index].value;
      temp_game_properties[i].console = e.target[index + 1].value;
      temp_game_properties[i].mrp = e.target[index + 2].value;
      console.log(temp_game_properties[i]);
    }

    const newGame = {
      todo_description: this.state.game_name,
      todo_responsible: this.state.game_description,
      game_properties: temp_game_properties
    };

    // axios
    //   .post("http://localhost:4000/todos/add", newTodo)
    //   .then(res => {
    //     console.log(res.data.todo);
    //     this.setState({
    //       status: res.data.todo
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.setState({
    //       status: "An Error has occured, check console log."
    //     });
    //   });

    this.setState({
      game_name: "",
      game_description: "",
      game_MRP: "",
      game_ps4: false,
      game_xbox: false
    });
  }

  render() {
    let status = this.state.status;
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Add New Game</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input type="text" className="form-control" name="name" />
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input type="text" className="form-control" name="description" />
          </div>
          {this.state.game_properties.map(game => (
            <div className="form-row" key={game.id}>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Serial No."
                  name="serial"
                />
              </div>
              <div className="form-group col-md-3">
                <select className="form-control" name="console">
                  <option>Choose a console</option>
                  <option>PS4</option>
                  <option>XBOX One</option>
                </select>
              </div>
              <div className="form-group col-md-1 ">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Price"
                  name="price"
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={this.onDelete}
                  id={game.id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="form-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onAdd}
            >
              Add
            </button>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Add new Game"
              className="btn btn-primary"
            />
          </div>
        </form>
        <span>{status}</span>
      </div>
    );
  }
}

export default AddGame;
