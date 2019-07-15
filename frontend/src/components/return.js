import React, { Component } from "react";
import axios from "axios";

class Return extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      show: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.getCustomerDetail();
  }
  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/return/" + this.state.id)
      .then(res => {
        console.log(res.data);
        if (res.data.length != 0)
          this.setState({
            games_to_return: res.data,
            show: true
          });
        else {
          this.setState({
            show: false
          });
        }
      })
      .catch(err => console.log(err));
  }

  convertDate(dates) {
    var date = new Date(dates);
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + "/" + mm + "/" + yyyy;
    console.log(today);
    return today;
  }

  handleClick(e) {
    console.log(e.target.id.split(" "));
    let id = e.target.id.split(" ");
    axios
      .post("http://localhost:4000/customer/return/" + this.state.id, {
        game_id: id[0],
        item_id: id[1]
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }
  render() {
    console.log(this.state.data);
    if (this.state.show) {
      return (
        <div>
          {this.state.games_to_return.map(game => (
            <div>
              <span />
              <span>{game.gameInfo.name}</span>
              <span>{game._id}</span>
              <span>{this.convertDate(game.game.dateIssue)}</span>
              <input
                type="button"
                value="Return"
                className="btn btn-primary"
                onClick={this.handleClick}
                id={game.game.game_id + " " + game.game.item_id}
              />
            </div>
          ))}
        </div>
      );
    } else return <div>No game to return</div>;
  }
}

export default Return;
