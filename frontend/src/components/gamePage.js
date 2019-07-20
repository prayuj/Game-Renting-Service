import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class GamePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      name: "",
      description: "",
      data: ""
    };
  }

  componentDidMount() {
    this.getGameDetail();
    this.getGameItemDetail();
    this.getHistory();
  }

  getGameDetail() {
    axios
      .get("http://localhost:4000/game/" + this.state.id)
      .then(res => {
        console.log(res.data, this.state.id);
        this.setState({
          name: res.data.name,
          description: res.data.description
        });
      })
      .catch(err => console.log(err));
  }

  getGameItemDetail() {
    axios
      .get("http://localhost:4000/game/items/" + this.state.id)
      .then(res => {
        console.log(res.data, this.state.id);
        this.setState({
          data: res.data
        });
      })
      .catch(err => console.log(err));
  }

  getHistory() {
    axios
      .get("http://localhost:4000/game/history/" + this.state.id)
      .then(res => {
        console.log(res.data, this.state.id);
        this.setState({
          history: res.data
        });
      })
      .catch(err => console.log(err));
  }

  setRedirect = e => {
    console.log(e.target.value);
    if (e.target.attributes[0].value === "transaction") {
      this.setState({
        redirect_to_transaction: true,
        transaction_id: e.target.attributes[1].value
      });
    }
    if (e.target.value === "Update")
      this.setState({
        redirect_to_update: true
      });

    if (e.target.value === "Issue")
      this.setState({
        redirect_to_issue: true
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
    if (this.state.redirect_to_transaction) {
      return <Redirect push to={"/transaction/" + this.state.transaction_id} />;
    }
    if (this.state.redirect_to_issue) {
      return <Redirect push to={"/issue/mode=game&id=" + this.state.id} />;
    }
  };

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    return today;
  }
  render() {
    console.log(this.state.data);
    let items = this.state.data ? (
      this.state.data.map((item, index) => (
        <tr>
          <td>{index + 1}</td>
          <td>{item.items.serial_no}</td>
          <td>{item.items.console}</td>
          <td>{item.items.status}</td>
          <td>
            {item.convertedId == "Owner" ? "Owner" : item.customerInfo[0].name}
          </td>
        </tr>
      ))
    ) : (
      <div />
    );

    let history = this.state.history ? (
      this.state.history.map((hist, index) => (
        <tr
          value="transaction"
          id={hist._id}
          className="items"
          onClick={this.setRedirect}
        >
          <td value="transaction" id={hist._id}>
            {index + 1}
          </td>
          <td value="transaction" id={hist._id}>
            {hist.gameInfo.items.serial_no}
          </td>
          <td value="transaction" id={hist._id}>
            {hist.gameInfo.items.console}
          </td>
          <td value="transaction" id={hist._id}>
            {hist.customerInfo.name}
          </td>
          <td value="transaction" id={hist._id}>
            {this.convertDate(hist.date_issue)}
          </td>
          <td value="transaction" id={hist._id}>
            {hist.return ? this.convertDate(hist.date_return) : "Not Returned"}
          </td>
        </tr>
      ))
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
        <input
          type="button"
          onClick={this.setRedirect}
          className="btn btn-primary"
          value="Issue"
        />
        <h3>Name: {this.state.name}</h3>
        <h3>Description: {this.state.description}</h3>
        <br />
        <h3>Current Status of Items:</h3>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Serial Number</th>
              <th>Console</th>
              <th>Status</th>
              <th>Responsible</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </table>
        <br />
        <h3>Past History of Items:</h3>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Serial Number</th>
              <th>Console</th>
              <th>Name</th>
              <th>Date Issue</th>
              <th>Date Return</th>
            </tr>
          </thead>
          <tbody>{history}</tbody>
        </table>
      </div>
    );
  }
}

export default GamePage;
