import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class TransactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      redirect_to_customer: false,
      redirect_to_game: false
    };
    this.getTransactionDetails = this.getTransactionDetails.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getTransactionDetails();
  }

  componentDidUpdate() {
    this.getTransactionDetails();
  }

  getTransactionDetails() {
    axios
      .get("http://localhost:4000/transaction/" + this.state.id)
      .then(res => {
        this.setState({
          data: res.data
        });
      });
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

  setRedirect = e => {
    console.log(
      e.target.value === "Go to " + this.state.data.customerInfo.name
    );
    if (e.target.value === "Go to " + this.state.data.customerInfo.name)
      this.setState({
        redirect_to_customer: true
      });
    else if (e.target.value === "Go to " + this.state.data.gameInfo.name)
      this.setState({
        redirect_to_game: true
      });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_game) {
      return <Redirect push to={"/game/" + this.state.data.gameInfo._id} />;
    }
    if (this.state.redirect_to_customer) {
      return (
        <Redirect push to={"/customer/" + this.state.data.customerInfo._id} />
      );
    }
  };

  handleClick(e) {
    console.log(e.target.id);
    let id = e.target.id.split(" ");
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
    if (this.state.data)
      return (
        <div>
          {this.renderRedirect()}
          <h4>Transaction ID: {this.state.id}</h4>
          <h4>Member Name: {this.state.data.customerInfo.name}</h4>

          <h4>Game Name: {this.state.data.gameInfo.name}</h4>
          <h4>Console: {this.state.data.gameInfo.items.console}</h4>
          <h4>Serial Number: {this.state.data.gameInfo.items.serial_no}</h4>
          <h4>Date Issued: {this.convertDate(this.state.data.date_issue)}</h4>
          <h4>
            {this.state.data.return
              ? "Date Returned:" + this.convertDate(this.state.data.date_return)
              : "Status: Not Returned"}
          </h4>
          <input
            type="button"
            value={"Go to " + this.state.data.customerInfo.name}
            className="btn btn-primary"
            onClick={this.setRedirect}
          />
          <br />
          <br />
          <input
            type="button"
            value={"Go to " + this.state.data.gameInfo.name}
            className="btn btn-primary"
            onClick={this.setRedirect}
          />
          <br />
          <br />
          {this.state.data.return ? (
            <div />
          ) : (
            <input
              type="button"
              value="Return"
              className="btn btn-primary"
              id={
                this.state.data._id +
                " " +
                this.state.data.game_id +
                " " +
                this.state.data.item_id
              }
              onClick={this.handleClick}
            />
          )}
        </div>
      );
    else return <div>Let me Load</div>;
  }
}

export default TransactionPage;