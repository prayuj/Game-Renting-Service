import React, { Component } from "react";
import axios from "axios";

class Issue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      show: true,
      games: []
    };
    this.handleForm = this.handleForm.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
    this.getGames();
  }
  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/issue/" + this.state.id)
      .then(res => {
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
  }
  getGames() {
    axios.get("http://localhost:4000/game/issue/get").then(res => {
      console.log(res.data);
      this.setState({
        games: res.data
      });
    });
  }
  handleForm(e) {
    e.preventDefault();
    console.log(e.target.game.value, e.target.console.value);
    let game_id = e.target.game.value;
    let game_console = e.target.console.value;
    let data = {
      game_id: game_id,
      console: game_console
    };
    axios
      .post("http://localhost:4000/customer/issue/" + this.state.id, data)
      .then(res => {
        alert(res.data.game);
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  }
  render() {
    console.log(this.state.data);
    if (this.state.show)
      return (
        <div>
          <form onSubmit={this.handleForm}>
            <label>Game</label>
            <select className="form-control" name="game">
              <option>Choose a game</option>
              {this.state.games.map(game => (
                <option value={game._id}>{game.name}</option>
              ))}
            </select>
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
