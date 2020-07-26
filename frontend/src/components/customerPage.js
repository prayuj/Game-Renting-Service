import React, { Component } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import LoadingSpinner from "./loadingSpinner";
import Toast from "react-bootstrap/Toast";

class CustomerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      data: "",
      history: [],
      modal_show: false,
      history_loaded: false,
      data_loaded: false,
      otp_issued: false,
      verifying: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getCustomerDetail();
    this.getCustomerGameHistory();
  }
  getCustomerGameHistory() {
    axios
      .get(this.props.url + "/customer/history/" + this.state.id)
      .then((res) => {
        console.log(res.data);
        if (res.data)
          this.setState({
            history: res.data,
            history_loaded: true,
          });
        else
          this.setState({
            history: [],
            history_loaded: true,
          });
      })
      .catch((err) => console.log(err));
  }
  getCustomerDetail() {
    axios
      .get(this.props.url + "/customer/" + this.state.id)
      .then((res) => {
        this.setState({
          data: res.data,
          data_loaded: true,
        });
      })
      .catch((err) => console.log(err));
  }

  setRedirect = (e) => {
    console.log(e.target.attributes[1].value);
    if (e.target.attributes[0].value === "transaction") {
      this.setState({
        redirect_to_transaction: true,
        transaction_id: e.target.attributes[1].value,
      });
    } else if (e.target.value === "Update") {
      this.setState({
        otp_issued: false,
        verifying: false,
      });
      axios
        .get(
          this.props.url +
            "/customer/generate_otp/id=" +
            this.state.id +
            "&mode=Updating&game=Null&console=Null"
        )
        .then((res) => {
          console.log(res.data);
          this.setState({ message: res.data.message, otp_issued: true });
        });
      this.setState({
        modal_show: true,
      });
    } else if (e.target.value === "Issue")
      this.setState({
        redirect_to_issue: true,
      });
    else if (e.target.value === "Return")
      this.setState({
        redirect_to_return: true,
      });
    else if (e.target.value === "Add Plan")
      this.setState({
        redirect_to_add_plan: true,
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
    this.setState({
      verifying: true,
    });
    axios
      .post(this.props.url + "/customer/verify_otp/" + customer_id, {
        otp: e.target.otp.value,
      })
      .then((res) => {
        console.log(res.data.isVerify);
        if (res.data.isVerify) {
          this.setState({
            redirect_to_update: true,
          });
        } else {
          this.setState({ verifying: false });
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

    let history =
      this.state.history.length > 0 ? (
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
              {game.return
                ? this.convertDate(game.date_return)
                : "Not Returned"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="6"
            style={{ position: "relative", top: "50%", left: "50%" }}
          >
            No Past History
          </td>
        </tr>
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
        {this.state.data_loaded ? (
          <>
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
          </>
        ) : (
          <div>
            <LoadingSpinner></LoadingSpinner>
          </div>
        )}
        <div className="table-responsive-xl">
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
            <tbody>
              {this.state.data_loaded ? (
                membership
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ position: "relative", top: "50%", left: "50%" }}
                  >
                    <LoadingSpinner></LoadingSpinner>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <h3>Past History:</h3>
        <div className="table-responsive-xl">
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
            <tbody>
              {this.state.history_loaded ? (
                history
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ position: "relative", top: "50%", left: "50%" }}
                  >
                    <LoadingSpinner></LoadingSpinner>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              {this.state.otp_issued ? (
                <Toast>
                  <Toast.Header>
                    <strong className="mr-auto">OTP</strong>
                  </Toast.Header>
                  <Toast.Body>{this.state.message}</Toast.Body>
                </Toast>
              ) : (
                <LoadingSpinner></LoadingSpinner>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.setState({ modal_show: false })}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                {this.state.verifying ? (
                  <LoadingSpinner></LoadingSpinner>
                ) : (
                  "Verify"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

export default CustomerPage;
