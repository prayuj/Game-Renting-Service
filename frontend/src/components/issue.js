import React, { Component } from "react";
import axios from "axios";

class Issue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      show: true
    };
    this.handleForm = this.handleForm.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
  }
  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/issue/" + this.state.id)
      .then(res => {
        console.log(res.data[0]);
        if (res.data[0].membership.length == 0) {
          console.log("No Active Membership");
          this.setState({
            show: false
          });
        } else if (
          res.data[0].membership[0].plan === "1Y4G" &&
          res.data[0].game.length < 4
        ) {
          console.log("4 game plan");
          this.setState({
            show: true
          });
        } else if (
          res.data[0].membership[0].plan === "6M2G" &&
          res.data[0].game.length < 2
        ) {
          console.log("2 game plan");
          this.setState({
            show: true
          });
        } else if (
          res.data[0].membership[0].plan === "3M1G" &&
          res.data[0].game.length < 1
        ) {
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
  }
  handleForm(e) {
    e.preventDefault();
    console.log(e.target.game.value, e.target.console.value);
    let game_id = e.target.game.value;
    let game_console = e.target.console.value;
    axios
      .post("http://localhost:4000/game/issue", {
        game_id: game_id,
        cust_id: this.state.id,
        console: game_console
      })
      .then(res => {
        console.log(res.data.game_item_id);
        if (res.data.game_item_id === "Not Available") {
          console.log("Cant Issue game due to unavailbility");
        } else {
          let sendObject = {
            game_id: game_id,
            item_id: res.data.game_item_id,
            dateIssue: new Date(),
            return: false
          };
          axios
            .post(
              "http://localhost:4000/customer/issue/" + this.state.id,
              sendObject
            )
            .then(res => {
              console.log(res.data);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    console.log(this.state.data);
    if (this.state.show)
      return (
        <div>
          <form onSubmit={this.handleForm}>
            <label>Game ID</label>
            <input name="game" className="form-control" placeholder="Game ID" />
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
    else return <div>Can't Issue game</div>;
  }
}

export default Issue;
