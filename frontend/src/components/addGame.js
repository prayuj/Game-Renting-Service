import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class AddGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game_name: "",
      game_description: "",
      game_MRP: "",
      game_ps4: false,
      serial_ps4: "",
      game_xbox: false,
      serial_xbox: ""
    };

    this.onChangeGameDescription = this.onChangeGameDescription.bind(this);
    this.onChangeGameName = this.onChangeGameName.bind(this);
    this.onChangeGameMRP = this.onChangeGameMRP.bind(this);
    this.onChangePS4 = this.onChangePS4.bind(this);
    this.onCounterPS4 = this.onCounterPS4.bind(this);
    this.onChangeXBOX = this.onChangeXBOX.bind(this);
    this.onCounterXBOX = this.onCounterXBOX.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

    console.log(`Form submitted:`);
    console.log(`Game Name: ${this.state.game_name}`);
    console.log(`Game Description: ${this.state.game_description}`);
    console.log(`Game MRP: ${this.state.game_MRP}`);
    console.log(`PS4: ${this.state.game_ps4}`);
    console.log(`XBOX: ${this.state.game_xbox}`);

    // const newTodo = {
    //   todo_description: this.state.todo_description,
    //   todo_responsible: this.state.todo_responsible,
    //   todo_priority: this.state.todo_priority,
    //   todo_completed: this.state.todo_completed
    // };

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
            <input
              type="text"
              className="form-control"
              value={this.state.game_name}
              onChange={this.onChangeGameName}
            />
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.game_description}
              onChange={this.onChangeGameDescription}
            />
          </div>
          <div className="form-group">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="inlineCheckbox1"
                value="PS4"
                checked={this.state.game_ps4}
                onChange={this.onChangePS4}
              />
              <label class="form-check-label" for="inlineCheckbox1">
                PS4
              </label>
              <div class="col" style={{ display: "inline" }}>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Number"
                  disabled={!this.state.game_ps4}
                />
              </div>
            </div>
            <br />
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="checkbox"
                id="inlineCheckbox2"
                value="XBOX"
                checked={this.state.game_xbox}
                onChange={this.onChangeXBOX}
              />
              <label class="form-check-label" for="inlineCheckbox2">
                XBOX
              </label>
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Number"
                  disabled={!this.state.game_xbox}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Create Todo"
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
