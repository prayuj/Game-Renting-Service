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
        console.log(res.data[0].game);
        if (res.data[0].game.length != 0)
          this.setState({
            data: res.data,
            show: true
          });
        else {
          this.setState({
            show: false
          });
        }
      });
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
  //   handleForm(e) {
  //     e.preventDefault();
  //     console.log(e.target.game.value, e.target.console.value);
  //     let game_id = e.target.game.value;
  //     let game_console = e.target.console.value;
  //     axios
  //       .post("http://localhost:4000/game/issue", {
  //         game_id: game_id,
  //         cust_id: this.state.id,
  //         console: game_console
  //       })
  //       .then(res => {
  //         console.log(res.data.game_item_id);
  //         if (res.data.game_item_id === "Not Available") {
  //           console.log("Cant Issue game due to unavailbility");
  //         } else {
  //           let sendObject = {
  //             game_id: game_id,
  //             item_id: res.data.game_item_id,
  //             dateIssue: new Date(),
  //             return: false
  //           };
  //           axios
  //             .post(
  //               "http://localhost:4000/customer/issue/" + this.state.id,
  //               sendObject
  //             )
  //             .then(res => {
  //               console.log(res.body);
  //             })
  //             .catch(err => console.log(err));
  //         }
  //       })
  //       .catch(err => console.log(err));
  //   }
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
          {this.state.data[0].game.map(game => (
            <div>
              {!game.return ? (
                <div>
                  <span>{game.game_id}</span>
                  <span>{game.item_id}</span>
                  <span>{this.convertDate(game.dateIssue)}</span>
                  <input
                    type="button"
                    value="Return"
                    className="btn btn-primary"
                    onClick={this.handleClick}
                    id={game.game_id + " " + game.item_id}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      );
    } else return <div>No game to return</div>;
  }
}

export default Return;
