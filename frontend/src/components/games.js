import React, { Component } from "react";
import Game from "./game";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    axios.get("http://localhost:4000/game/").then(res => {
      this.setState({
        games: res.data
      });
    });
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/add_game/"} />;
    }
  };
  render() {
    return (
      <div>
        {this.renderRedirect()}
        <input
          type="button"
          className="btn btn-primary"
          value="Add Game"
          onClick={this.setRedirect}
        />
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Available In</th>
              <th>Number Available</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map((game, index) => (
              <Game
                mode="games"
                _id={game._id}
                sr={index + 1}
                name={game.name}
                availableIn={
                  game.numberPS4Available > 0
                    ? game.numberXBOXAvailable > 0
                      ? ["PS4", "XBOX One"]
                      : ["PS4"]
                    : game.numberXBOXAvailable > 0
                    ? ["XBOX One"]
                    : ["Not Available"]
                }
                noAvailable={game.numberAvailable}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Games;
