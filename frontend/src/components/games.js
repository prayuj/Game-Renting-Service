import React, { Component } from "react";
import Game from "./game";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      filtered: [],
      ascendingName: true,
      ascendingAvailable: true,
      nameSortButtonValue: <span>&darr;</span>,
      availableSortButtonValue: "Sort"
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClickForSort = this.onClickForSort.bind(this);
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    axios.get("http://localhost:4000/game/").then(res => {
      this.setState({
        games: res.data,
        filtered: res.data
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

  handleChange(e) {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (e.target.value !== "") {
      console.log("HERE 1");
      // Assign the original list to currentList
      currentList = this.state.games;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter(item => {
        // change current item to lowercase
        const lc = item.name.toLowerCase();
        // change search term to lowercase
        const filter = e.target.value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
      console.log(newList);
    } else {
      console.log("HERE 2");
      // If the search bar is empty, set newList to original task list
      newList = this.state.games;
    }
    // Set the filtered state based on what our rules added to newList
    this.setState({
      filtered: newList
    });
  }

  onClickForSort(e) {
    console.log(e.target.value);
    if (e.target.value === "Name") {
      let games = this.state.games;
      games.sort((a, b) => {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (this.state.ascendingName) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingName) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(games);
      let arrow = this.state.ascendingName ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        games: games,
        ascendingName: !this.state.ascendingName,
        nameSortButtonValue: arrow,
        availableSortButtonValue: "Sort"
      });
    }
    if (e.target.value === "Available") {
      let games = this.state.games;
      games.sort((a, b) => {
        var x = a.numberAvailable;
        var y = b.numberAvailable;
        if (this.state.ascendingAvailable) {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
        if (!this.state.ascendingAvailable) {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        }
      });
      console.log(games);
      let arrow = this.state.ascendingAvailable ? (
        <span>&darr;</span>
      ) : (
        <span>&uarr;</span>
      );
      this.setState({
        games: games,
        ascendingAvailable: !this.state.ascendingAvailable,
        availableSortButtonValue: arrow,
        nameSortButtonValue: "Sort"
      });
    }
  }

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
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={this.handleChange}
        />
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: "1.3%" }}>Sr</th>
              <th>
                Name
                <button
                  className="btn btn-primary"
                  value="Name"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.nameSortButtonValue}
                </button>
              </th>
              <th style={{ paddingBottom: "1.3%" }}>Available In</th>
              <th>
                Number Available{" "}
                <button
                  className="btn btn-primary"
                  value="Available"
                  onClick={this.onClickForSort}
                  style={{ "margin-left": "5%" }}
                >
                  {this.state.availableSortButtonValue}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.filtered.map((game, index) => (
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
