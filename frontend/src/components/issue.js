import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Issue extends Component {
  constructor(props) {
    super(props);
    if (props.match.params.mode === "customer")
      this.state = {
        mode: "customer",
        customer_id: props.match.params.id,
        show: false,
        games: [],
        redirect_to_transaction: false
      };
    else if (props.match.params.mode === "game")
      this.state = {
        mode: "game",
        game_id: props.match.params.id,
        show: false,
        customers: [],
        redirect_to_transaction: false
      };
    else if (props.match.params.mode === "transaction")
      this.state = {
        mode: "transaction",
        customers: [],
        show: false,
        games: [],
        redirect_to_transaction: false
      };
    this.handleForm = this.handleForm.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
    this.getGames();
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
    } else if (this.state.mode === "game") {
      axios
        .get("http://localhost:4000/customer")
        .then(res => {
          let customers_to_display = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].plan === "1Y4G" && res.data[i].noOfGames < 4) {
              console.log("4 game plan");
              customers_to_display.push(res.data[i]);
            } else if (
              res.data[i].plan === "6M2G" &&
              res.data[i].noOfGames < 2
            ) {
              console.log("2 game plan");
              customers_to_display.push(res.data[i]);
            } else if (
              res.data[i].plan === "3M1G" &&
              res.data[i].noOfGames < 1
            ) {
              console.log("1 game plan");
              customers_to_display.push(res.data[i]);
            } else {
              console.log("5th condition");
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
    if (this.state.mode === "customer")
      axios.get("http://localhost:4000/game/issue/get").then(res => {
        console.log(res.data);
        this.setState({
          games: res.data
        });
      });
    else if (this.state.mode === "game")
      axios
        .get("http://localhost:4000/game/" + this.state.game_id)
        .then(res => {
          this.setState({
            games: [res.data]
          });
          if (res.data.numberAvailable > 0) {
            this.setState({
              show: true
            });
          }
        });
  }
  handleForm(e) {
    e.preventDefault();
    console.log(
      e.target.game.value,
      e.target.console.value,
      e.target.customer.value
    );
    let customer_id = e.target.customer.value;
    let game_id = e.target.game.value;
    let game_console = e.target.console.value;
    let data = {
      game_id: game_id,
      console: game_console
    };
    axios
      .post("http://localhost:4000/customer/issue/" + customer_id, data)
      .then(res => {
        if (res.data.game != "Not Available") {
          alert("Game Issued");
          this.setState({
            transactionid: res.data.game
          });
          this.setRedirect();
        } else {
          alert("Game Not issued");
        }
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
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
      let console;
      if (this.state.mode === "customer") {
        customers = (
          <select className="form-control" name="customer" disabled={true}>
            {this.state.customers.map(customer => (
              <option value={customer._id}>{customer.name}</option>
            ))}
          </select>
        );
        games = (
          <select className="form-control" name="game">
            <option>Choose a game</option>
            {this.state.games.map(game => (
              <option value={game._id}>{game.name}</option>
            ))}
          </select>
        );
      }

      if (this.state.mode === "game") {
        customers = (
          <select className="form-control" name="customer">
            <option>Choose a customer</option>
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

      return (
        <div>
          {this.renderRedirect()}
          <form onSubmit={this.handleForm}>
            <label>Customer Name</label>
            {customers}
            <label>Game</label>
            {games}
            <label>Console</label>
            <select className="form-control" name="console">
              <option>Choose a console</option>
              <option>PS4</option>
              <option>XBOX One</option>
            </select>
            <input type="submit" value="Check" className="btn btn-primary" />
          </form>
        </div>
      );
    } else return <div>Can't Issue game</div>;
  }
}

export default Issue;
