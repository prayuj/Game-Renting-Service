import React, { Component } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";

class CustomerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      data: "",
      modal_show: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getCustomerDetail();
    this.getCustomerGameHistory();
  }
  getCustomerGameHistory() {
    axios
      .get("http://localhost:4000/customer/history/" + this.state.id)
      .then(res => {
        console.log(res.data);
        if (res.data)
          this.setState({
            history: res.data
          });
        else
          this.setState({
            history: []
          });
      })
      .catch(err => console.log(err));
  }
  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/" + this.state.id)
      .then(res => {
        this.setState({
          data: res.data
        });
      })
      .catch(err => console.log(err));
  }

  setRedirect = e => {
    console.log(e.target.attributes[1].value);
    if (e.target.attributes[0].value === "transaction") {
      this.setState({
        redirect_to_transaction: true,
        transaction_id: e.target.attributes[1].value
      });
    } else if (e.target.value === "Update") {
      axios.get(
        "http://localhost:4000/customer/generate_otp/id=" +
          this.state.id +
          "&mode=Updating"
      );
      this.setState({
        modal_show: true
      });
    } else if (e.target.value === "Issue")
      this.setState({
        redirect_to_issue: true
      });
    else if (e.target.value === "Return")
      this.setState({
        redirect_to_return: true
      });
    else if (e.target.value === "Add Plan")
      this.setState({
        redirect_to_add_plan: true
      });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_update) {
      return <Redirect push to={"/update_customer/" + this.state.id} />;
    }
    if (this.state.redirect_to_add_plan) {
      return <Redirect push to={"/add_plan/" + this.state.id} />;
    }
    if (this.state.redirect_to_issue) {
      return <Redirect push to={"/issue/mode=customer&id=" + this.state.id} />;
    }
    if (this.state.redirect_to_return) {
      return <Redirect push to={"/return/mode=customer&id=" + this.state.id} />;
    }
    if (this.state.redirect_to_transaction) {
      return <Redirect push to={"/transaction/" + this.state.transaction_id} />;
    }
  };

  handleClick(e) {
    e.preventDefault();
    console.log(e.target.otp.value);
    let customer_id = this.state.id;
    axios
      .post("http://localhost:4000/customer/verify_otp/" + customer_id, {
        otp: e.target.otp.value
      })
      .then(res => {
        console.log(res.data.isVerify);
        if (res.data.isVerify) {
          this.setState({
            redirect_to_update: true
          });
        } else {
          alert("Incorrect OTP, Issue again");
        }
      });
  }

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
    let membership = this.state.data.membership ? (
      this.state.data.membership.map((member, index) => (
        <tr>
          <td>{index + 1}</td>
          <td>{member.plan}</td>
          <td>{this.convertDate(member.start)}</td>
          <td>{this.convertDate(member.end)}</td>
          <td>{member.active ? "True" : "False"}</td>
        </tr>
      ))
    ) : (
      <div />
    );

    let history = this.state.history ? (
      this.state.history.map((game, index) => (
        <tr
          className="items"
          onClick={this.setRedirect}
          value="transaction"
          id={game._id}
        >
          <td value="transaction" id={game._id}>
            {index + 1}
          </td>
          <td value="transaction" id={game._id}>
            {game.gameInfo.name}
          </td>
          <td value="transaction" id={game._id}>
            {game.gameInfo.items.console}
          </td>
          <td value="transaction" id={game._id}>
            {game.gameInfo.items.serial_no}
          </td>
          <td value="transaction" id={game._id}>
            {this.convertDate(game.date_issue)}
          </td>
          <td value="transaction" id={game._id}>
            {game.return ? this.convertDate(game.date_return) : "Not Returned"}
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
          value="Add Plan"
        />
        <input
          type="button"
          onClick={this.setRedirect}
          className="btn btn-primary"
          value="Issue"
        />
        <input
          type="button"
          onClick={this.setRedirect}
          className="btn btn-primary"
          value="Return"
        />
        <div>
          <strong>Name: </strong> {this.state.data.name}
        </div>
        <div>
          <strong>Email: </strong>
          {this.state.data.email}
        </div>
        <div>
          <strong>Addr: </strong>
          {this.state.data.address}
        </div>
        <div>
          <strong>Addr2: </strong>
          {this.state.data.address2}
        </div>
        <div>
          <strong>ZIP: </strong>
          {this.state.data.zip}
        </div>
        <div>
          <strong>Mobile Number: </strong>
          {this.state.data.mobile_no}
        </div>
        <div>
          <strong>Alt Mobile No: </strong>
          {this.state.data.alt_mobile_no}
        </div>
        <div>
          <strong>Date Of Join: </strong>
          {this.convertDate(this.state.data.dateOfJoin)}
        </div>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Plan Name</th>
              <th>Start</th>
              <th>End</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>{membership}</tbody>
        </table>
        <h3>Past History:</h3>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Game</th>
              <th>Console</th>
              <th>Serial no</th>
              <th>Date Issue</th>
              <th>Date Return</th>
            </tr>
          </thead>
          <tbody>{history}</tbody>
        </table>
        <Modal show={this.state.modal_show}>
          <Modal.Header>
            <Modal.Title>Game Return</Modal.Title>
          </Modal.Header>
          <form onSubmit={this.handleClick}>
            <Modal.Body>
              <div>
                Enter OTP
                <input type="number" name="otp" />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.setState({ modal_show: false })}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

export default CustomerPage;
