import React, { Component } from "react";
import Game from "./game";
import Modal from "./modal";

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [
        {
          id: 1,
          name: "Marvel's Spider Man",
          availableIn: ["PS4", "Xbox One"],
          status: "In store",
          noAvailable: 2
        },
        {
          id: 2,
          name: "Grand Theft Auto V",
          availableIn: ["PS4", "Xbox One"],
          status: "In store",
          noAvailable: 1
        },
        {
          id: 3,
          name: "God of War - Standard Edition",
          availableIn: ["PS4"],
          status: "In store",
          noAvailable: 4
        },
        {
          id: 4,
          name: "Watch Dogs 2",
          availableIn: ["PS4", "Xbox One"],
          status: "In store",
          noAvailable: 1
        },
        {
          id: 5,
          name: "Far Cry 5",
          availableIn: ["Xbox One"],
          status: "Not in Stock",
          noAvailable: 0
        },
        {
          id: 6,
          name: "WWE 2K19",
          availableIn: ["PS4", "Xbox One"],
          status: "Unavailable",
          noAvailable: 0
        },
        {
          id: 7,
          name: "Call of Duty: Infinite Warfare",
          availableIn: ["PS4", "Xbox One"],
          status: "In store",
          noAvailable: 2
        }
      ]
    };
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
              <th>Status</th>
              <th>Number Available</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map(game => (
              <Game
                id={game.id}
                name={game.name}
                availableIn={game.availableIn}
                status={game.status}
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
