import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Issue extends Component {
  constructor(props) {
    super(props);
    if (props.match.params.mode === "customer")
      this.state = {
        mode: "customer",
        customer_id: props.match.params.id,
        show: false,
        games: [],
        console: [],
        redirect_to_transaction: false,
        modal_show: false,
        button_disable: true
      };
    else if (props.match.params.mode === "game")
      this.state = {
        mode: "game",
        game_id: props.match.params.id,
        show: false,
        customers: [],
        console: [],
        redirect_to_transaction: false,
        modal_show: false,
        button_disable: true
      };
    else if (props.match.params.mode === "dashboard")
      this.state = {
        mode: "dashboard",
        customers: [],
        show: true,
        games: [],
        console: [],
        redirect_to_transaction: false,
        modal_show: false,
        button_disable: true
      };
    this.handleForm = this.handleForm.bind(this);
    this.handleGameChange = this.handleGameChange.bind(this);
    this.confirmIssue = this.confirmIssue.bind(this);
    this.modalClose = this.modalClose.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
    this.getGames();
  }

  componentDidUpdate() {
    console.log(this.state.mode, this.props.match.params.mode);
    if (this.state.mode !== this.props.match.params.mode) {
      if (this.props.match.params.mode === "customer")
        this.setState(
          {
            mode: "customer",
            customer_id: this.props.match.params.id
          },
          () => {
            this.getCustomerDetail();
            this.getGames();
          }
        );
      else if (this.props.match.params.mode === "game")
        this.setState(
          {
            mode: "game",
            game_id: this.props.match.params.id
          },
          () => {
            this.getCustomerDetail();
            this.getGames();
          }
        );
      else if (this.props.match.params.mode === "dashboard")
        this.setState(
          {
            mode: "dashboard",
            show: true
          },
          () => {
            this.getCustomerDetail();
            this.getGames();
          }
        );
    }
  }

  getCustomerDetail() {
    if (this.state.mode === "customer") {
      axios
        .get("http://localhost:4000/customer/issue/" + this.state.customer_id)
        .then(res => {
          console.log(res.data);
          this.setState({
            customers: [res.data]
          });
          if (res.data.length == 0) {
            console.log("No Active Membership");
            this.setState({
              show: false
            });
          } else if (res.data.plan === "1Y4G" && res.data.noOfGames < 4) {
            console.log("4 game plan");
            this.setState({
              show: true
            });
          } else if (res.data.plan === "6M2G" && res.data.noOfGames < 2) {
            console.log("2 game plan");
            this.setState({
              show: true
            });
          } else if (res.data.plan === "3M1G" && res.data.noOfGames < 1) {
            console.log("1 game plan");
            this.setState({
              show: true
            });
          } else {
            console.log("5th condition");
            this.setState({
              show: false
            });
          }
          this.setState({
            data: res.data[0]
          });
        })
        .catch(err => console.log(err));
    } else {
      axios
        .get("http://localhost:4000/customer")
        .then(res => {
          let customers_to_display = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].latestMembership.active) {
              if (
                res.data[i].latestMembership.plan === "1Y4G" &&
                res.data[i].noOfGames < 4
              ) {
                console.log("4 game plan");
                customers_to_display.push(res.data[i]);
              } else if (
                res.data[i].latestMembership.plan === "6M2G" &&
                res.data[i].noOfGames < 2
              ) {
                console.log("2 game plan");
                customers_to_display.push(res.data[i]);
              } else if (
                res.data[i].latestMembership.plan === "3M1G" &&
                res.data[i].noOfGames < 1
              ) {
                console.log("1 game plan");
                customers_to_display.push(res.data[i]);
              } else {
                console.log("5th condition");
              }
            }
          }
          this.setState({
            customers: customers_to_display
          });
        })
        .catch(err => console.log(err));
    }
  }
  getGames() {
    if (this.state.mode === "game")
      axios
        .get("http://localhost:4000/game/" + this.state.game_id)
        .then(res => {
          console.log(res.data);
          this.setState({
            games: [res.data]
          });
          if (res.data.numberAvailable > 0) {
            this.setState({
              show: true
            });
          }
          if (
            res.data.numberPS4Available > 0 &&
            res.data.numberXBOXAvailable > 0
          ) {
            this.setState({
              console: ["PS4", "XBOX One"]
            });
          } else if (res.data.numberPS4Available > 0) {
            this.setState({
              console: ["PS4"]
            });
          } else if (res.data.numberXBOXAvailable > 0) {
            this.setState({
              console: ["XBOX One"]
            });
          } else {
            this.setState({
              console: []
            });
          }
        });
    else
      axios.get("http://localhost:4000/game").then(res => {
        console.log(res.data);
        this.setState({
          games: res.data
        });
      });
  }

  modalClose() {
    {
      this.setState({ modal_show: false });
    }
  }

  confirmIssue(e) {
    e.preventDefault();
    console.log(
      e.target.game.value,
      e.target.console.value,
      e.target.customer.value
    );
    if (
      e.target.game.value != "default" &&
      e.target.console.value != "default" &&
      e.target.customer.value != "default"
    ) {
      this.setState({
        modal_show: true,
        game_id: e.target.game.value,
        selected_console: e.target.console.value,
        customer_id: e.target.customer.value,
        button_disable: false
      });
      console.log(
        "http://localhost:4000/customer/generate_otp/id=" +
          e.target.customer.value +
          "&mode=Issuing" +
          "&game=" +
          e.target.game.value +
          "&console=" +
          e.target.console.value
      );
      axios.get(
        "http://localhost:4000/customer/generate_otp/id=" +
          e.target.customer.value +
          "&mode=Issuing" +
          "&game=" +
          e.target.game.value +
          "&console=" +
          e.target.console.value
      );
    } else this.setState({ modal_show: true });
  }
  handleForm(e) {
    e.preventDefault();
    console.log(e.target.otp.value);
    let customer_id = this.state.customer_id;
    let game_id = this.state.game_id;
    let game_console = this.state.selected_console;
    let data = {
      game_id: game_id,
      console: game_console
    };
    console.log(JSON.stringify(data));
    axios
      .post("http://localhost:4000/customer/verify_otp/" + customer_id, {
        otp: e.target.otp.value
      })
      .then(res => {
        console.log(res.data.isVerify);
        if (res.data.isVerify) {
          axios
            .post("http://localhost:4000/customer/issue/" + customer_id, data)
            .then(res => {
              if (res.data.game != "Not Available") {
                this.setState({
                  show: true
                });
                this.setState({
                  transactionid: res.data.game
                });
                this.setRedirect();
              } else {
                alert(res.data.game);
              }
            })
            .catch(err => {
              alert(JSON.stringify(err));
            });
        } else {
          alert("Incorrect OTP, Issue again");
        }
      });
  }

  handleGameChange(e) {
    console.log(e.target.value);
    let games = this.state.games;
    for (let i = 0; i < games.length; i++) {
      if (games[i]._id === e.target.value) {
        if (
          games[i].numberPS4Available > 0 &&
          games[i].numberXBOXAvailable > 0
        ) {
          this.setState({
            console: ["PS4", "XBOX One"]
          });
        } else if (games[i].numberPS4Available > 0) {
          this.setState({
            console: ["PS4"]
          });
        } else if (games[i].numberXBOXAvailable > 0) {
          this.setState({
            console: ["XBOX One"]
          });
        } else {
          this.setState({
            console: []
          });
        }
      }
    }
  }

  setRedirect = () => {
    this.setState({
      redirect_to_transaction: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_transaction) {
      return <Redirect push to={"/transaction/" + this.state.transactionid} />;
    }
  };
  render() {
    if (this.state.show) {
      let customers;
      let games;
      let console =
        this.state.console.length == 0 ? (
          <select className="form-control" name="console" disabled={true}>
            <option value="default">Not Available</option>
          </select>
        ) : (
          <select className="form-control" name="console">
            {this.state.console.map(cons => (
              <option>{cons}</option>
            ))}
          </select>
        );
      if (this.state.mode === "customer") {
        customers = (
          <select className="form-control" name="customer" disabled={true}>
            {this.state.customers.map(customer => (
              <option value={customer._id}>{customer.name}</option>
            ))}
          </select>
        );
        games = (
          <select
            className="form-control"
            name="game"
            onChange={this.handleGameChange}
            required
          >
            <option value="" selected disabled hidden>
              Choose a Game
            </option>
            {this.state.games.map(game => (
              <option value={game._id}>{game.name}</option>
            ))}
          </select>
        );
      }

      if (this.state.mode === "game") {
        customers = (
          <select className="form-control" name="customer" required>
            <option value="" selected disabled hidden>
              Choose a Customer
            </option>
            {this.state.customers.map(customer => (
              <option value={customer._id}>{customer.name}</option>
            ))}
          </select>
        );

        games = (
          <select className="form-control" name="game" disabled={true}>
            {this.state.games.map(game => (
              <option value={game._id}>{game.name}</option>
            ))}
          </select>
        );
      }

      if (this.state.mode === "dashboard") {
        customers = (
          <select className="form-control" name="customer" required>
            <option value="" selected disabled hidden>
              Choose a Customer
            </option>
            {this.state.customers.map(customer => (
              <option value={customer._id}>{customer.name}</option>
            ))}
          </select>
        );

        games = (
          <select
            className="form-control"
            name="game"
            onChange={this.handleGameChange}
            required
          >
            <option value="" selected disabled hidden>
              Choose a Game
            </option>
            {this.state.games.map(game => (
              <option value={game._id}>{game.name}</option>
            ))}
          </select>
        );
      }

      return (
        <div>
          {this.renderRedirect()}
          <form onSubmit={this.confirmIssue}>
            <label>Customer Name</label>
            {customers}
            <label>Game</label>
            {games}
            <label>Console</label>
            {console}
            <input
              type="submit"
              value="Issue OTP"
              className="btn btn-primary"
            />
          </form>
          <Modal show={this.state.modal_show}>
            <Modal.Header>
              <Modal.Title>Game Issue</Modal.Title>
            </Modal.Header>
            <form onSubmit={this.handleForm}>
              <Modal.Body>
                {this.state.button_disable ? (
                  <p>Fill in Details</p>
                ) : (
                  <div>
                    Enter OTP
                    <input type="number" name="otp" />
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={this.modalClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={this.state.button_disable}
                >
                  Save changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      );
    } else return <div>Can't Issue game</div>;
  }
}

export default Issue;
