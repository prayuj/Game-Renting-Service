import React, { Component } from "react";
import Game from "./game";
import axios from "axios";

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
      console.log(res.data);
      let temp_game = [];
      for (let i = 0; i < res.data.length; i++) {
        let PS4 = false;
        let XBOX = false;
        for (let j = 0; j < res.data[i].items.length; j++) {
          if (res.data[i].items[j].console === "PS4") PS4 = true;
          else XBOX = true;
        }
        if (PS4 && XBOX) {
          temp_game.push({
            _id: res.data[i]._id,
            name: res.data[i].name,
            noAvailable: res.data[i].items.length,
            availableIn: ["PS4", "Xbox One"]
          });
        } else if (PS4) {
          temp_game.push({
            _id: res.data[i]._id,
            name: res.data[i].name,
            noAvailable: res.data[i].items.length,
            availableIn: ["PS4"]
          });
        } else {
          temp_game.push({
            _id: res.data[i]._id,
            name: res.data[i].name,
            noAvailable: res.data[i].items.length,
            availableIn: ["Xbox One"]
          });
        }
      }
      this.setState({
        games: temp_game
      });
    });
  }
  render() {
    return (
      <div>
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
                _id={game._id}
                sr={index + 1}
                name={game.name}
                availableIn={game.availableIn}
                noAvailable={game.noAvailable}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Games;
