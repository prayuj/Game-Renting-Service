import React, { Component } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Return extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      show: false,
      modal_show: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.confirmReturn = this.confirmReturn.bind(this);
    this.modalClose = this.modalClose.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
  }
  componentDidUpdate() {
    this.getCustomerDetail();
  }
  confirmReturn(e) {
    console.log(e.target.id);
    let ids = e.target.id.split(" ");
    this.setState({
      modal_show: true,
      ids: ids
    });
  }

  modalClose() {
    {
      this.setState({ modal_show: false });
    }
  }
  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/return/" + this.state.id)
      .then(res => {
        console.log(res.data);
        if (res.data.length != 0)
          this.setState({
            games_to_return: res.data,
            show: true
          });
        else {
          this.setState({
            show: false
          });
        }
      })
      .catch(err => console.log(err));
  }

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");
    return today + " (" + hours + ":" + minutes + " hrs)";
  }

  handleClick() {
    let id = this.state.ids;
    axios
      .post("http://localhost:4000/customer/return/" + this.state.id, {
        transaction_id: id[0],
        game_id: id[1],
        item_id: id[2]
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }
  render() {
    if (this.state.show) {
      let games = this.state.games_to_return.map((game, index) => (
        <tr>
          <td>{index + 1}</td>
          <td>{game.gameInfo.name}</td>
          <td>{game.gameInfo.items.console}</td>
          <td>{game.gameInfo.items.serial_no}</td>
          <td>{this.convertDate(game.date_issue)}</td>
          <input
            type="button"
            value="Return"
            className="btn btn-primary"
            onClick={this.confirmReturn}
            id={game._id + " " + game.game_id + " " + game.item_id}
          />
        </tr>
      ));
      return (
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Game Name</th>
              <th>Console</th>
              <th>Serial No</th>
              <th>Issued</th>
              <th>Return</th>
            </tr>
          </thead>
          <tbody>{games}</tbody>
          <Modal show={this.state.modal_show}>
            <Modal.Header>
              <Modal.Title>Game Return</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Are you sure you want to Return?</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.modalClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClick}>
                Save changes
              </Button>
            </Modal.Footer>
          </Modal>
        </table>
      );
    } else return <div>No game to return</div>;
  }
}

export default Return;
