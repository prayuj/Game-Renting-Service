import React, { Component } from "react";

class GameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      items: [
        {
          console: "Choose a console",
          _id: 0,
          serial_no: "",
          mrp: "",
          description: "",
          status: "Available"
        }
      ],
      old_items: [],
      id_count: 0,
      count: 1
    };
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.onChangeOfAvailableButton = this.onChangeOfAvailableButton.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.descriptionChange = this.descriptionChange.bind(this);
    this.itemsChange = this.itemsChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mode === "update")
      this.setState({
        name: nextProps.name,
        description: nextProps.description,
        old_items: nextProps.items,
        count: nextProps.count,
        items: [],
        count: 0
      });
  }

  onAdd() {
    let items = this.state.items;
    items.push({
      _id: this.state.id_count + 1,
      serial_no: "",
      console: "",
      mrp: "",
      new: true,
      status: "Available"
    });
    console.log(items);
    this.setState({
      items: items,
      id_count: this.state.id_count + 1,
      count: this.state.count + 1
    });
  }
  onChangeOfAvailableButton(e) {
    console.log(e.target);
    let temp_old_items = this.state.old_items;
    for (let i = 0; i < temp_old_items.length; i++) {
      if (temp_old_items[i]._id == e.target.id) {
        temp_old_items[i].status =
          temp_old_items[i].status === "Unavailable"
            ? "Available"
            : "Unavailable";
      }
    }
    this.setState({
      old_items: temp_old_items
    });
  }
  onDelete(e) {
    console.log(e.target.id);
    let items = this.state.items;
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id == e.target.id.toString()) {
        console.log("Found");
        items.splice(i, 1);
      }
    }
    console.log(items);
    this.setState({
      items: items,
      count: this.state.count - 1
    });
  }
  handleForm(e) {
    e.preventDefault();
    console.log(this.state.count);
    this.props.handleForm(
      e,
      this.state.count,
      this.state.items,
      this.state.old_items
    );
  }

  nameChange(e) {
    console.log(e.target.value);
    this.setState({
      name: e.target.value
    });
  }

  descriptionChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  itemsChange(e) {
    console.log(e.target.name, e.target.value, e.target.id);
    let items = this.state.items;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item._id === parseInt(e.target.id)) {
        if (e.target.name === "serial") {
          item.serial_no = e.target.value;
        } else if (e.target.name === "console") {
          item.console = e.target.value;
        } else {
          item.mrp = e.target.value;
        }
      }
    }
    this.setState({
      items: items
    });
  }
  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <form onSubmit={this.handleForm}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={this.state.name}
              required
              onChange={this.nameChange}
            />
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={this.state.description}
              required
              onChange={this.descriptionChange}
            />
          </div>
          {this.state.old_items ? (
            this.state.old_items.map(game => (
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    id={game._id}
                    type="text"
                    className="form-control"
                    placeholder="Serial No."
                    name="serial"
                    disabled={true}
                    value={game.serial_no}
                  />
                </div>
                <div className="form-group col-md-3">
                  <select
                    className="form-control"
                    id={game._id}
                    name="console"
                    disabled={true}
                  >
                    <option>Choose a console</option>
                    <option selected={game.console === "PS4"}>PS4</option>
                    <option selected={game.console === "XBOX One"}>
                      XBOX One
                    </option>
                  </select>
                </div>
                <div className="form-group col-md-1 ">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Price"
                    name="price"
                    id={game._id}
                    disabled={true}
                    value={game.mrp}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.onChangeOfAvailableButton}
                    disabled={game.responsible === "Owner" ? false : true}
                    id={game._id}
                  >
                    {game.status === "Available"
                      ? "Make Unavailable"
                      : "Make Available"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div />
          )}
          {this.state.items.map(game => (
            <div className="form-row" onChange={this.itemsChange}>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  id={game._id}
                  className="form-control"
                  placeholder="Serial No."
                  name="serial"
                  value={game.serial_no}
                  required
                />
              </div>
              <div className="form-group col-md-3">
                <select className="form-control" name="console" id={game._id}>
                  <option selected={game.console === "PS4"}>PS4</option>
                  <option selected={game.console === "XBOX One"}>
                    XBOX One
                  </option>
                </select>
              </div>
              <div className="form-group col-md-1 ">
                <input
                  type="text"
                  id={game._id}
                  className="form-control"
                  placeholder="Price"
                  name="price"
                  value={game.mrp}
                  required
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={this.onDelete}
                  id={game._id}
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
              value={this.props.mode === "add" ? "Add new Game" : "Update Game"}
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default GameForm;
