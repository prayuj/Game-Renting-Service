import React, { Component } from "react";
import axios from "axios";

class TransactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id
    };
    this.getTransactionDetails = this.getTransactionDetails.bind(this);
  }

  componentDidMount() {
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
    return today + " " + hours + ":" + minutes + " hrs";
  }

  render() {
    console.log(this.state.data);
    if (this.state.data)
      return (
        <div>
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
        </div>
      );
    else return <div>Let me Load</div>;
  }
}

export default TransactionPage;
