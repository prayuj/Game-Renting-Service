import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class CustomerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      data: ""
    };
  }

  componentDidMount() {
    this.getCustomerDetail();
  }

  getCustomerDetail() {
    axios
      .get("http://localhost:4000/customer/" + this.state.id)
      .then(res => {
        this.setState({
          data: res.data
        });
      })
      .catch(err => console.log(err));
  }

  setRedirect = e => {
    console.log(e.target.value);
    if (e.target.value === "Update")
      this.setState({
        redirect_to_update: true
      });
    else
      this.setState({
        redirect_to_add_plan: true
      });
  };

  renderRedirect = () => {
    if (this.state.redirect_to_update) {
      return <Redirect push to={"/update_customer/" + this.state.id} />;
    }
    if (this.state.redirect_to_add_plan) {
      return <Redirect push to={"/add_plan/" + this.state.id} />;
    }
  };
  render() {
    console.log(this.state.data);
    let membership = this.state.data.membership ? (
      <div>
        {this.state.data.membership.map(member => (
          <div>
            <span>{member.plan}</span>
            <span>{member.start}</span>
            <span>{member.end}</span>
            <span>{member.active ? "True" : "False"}</span>
          </div>
        ))}
      </div>
    ) : (
      <div />
    );
    return (
      <div>
        {this.renderRedirect()}
        <input
          type="button"
          onClick={this.setRedirect}
          className="btn btn-primary"
          value="Update"
        />
        <input
          type="button"
          onClick={this.setRedirect}
          className="btn btn-primary"
          value="Add Plan"
        />
        <div>{this.state.data.name}</div>
        <div>{this.state.data.email}</div>
        <div>{this.state.data.address}</div>
        <div>{this.state.data.address2}</div>
        <div>{this.state.data.zip}</div>
        <div>{this.state.data.mobile_no}</div>
        <div>{this.state.data.alt_mobile_no}</div>
        <div>{this.state.data.dateOfJoin}</div>
        {membership}
      </div>
    );
  }
}

export default CustomerPage;
