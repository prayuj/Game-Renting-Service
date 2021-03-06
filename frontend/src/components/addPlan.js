import React, { Component } from "react";
import axios from "axios";

class AddPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      name: "",
      membership: [],
      status: false,
    };
    this.handleForm = this.handleForm.bind(this);
    this.getPlans = this.getPlans.bind(this);
  }

  componentDidMount() {
    this.getPlans();
  }

  getPlans() {
    axios.get(this.props.url + "/customer/" + this.state.id).then((res) => {
      this.setState({
        membership: res.data.membership,
      });
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

  handleForm(e) {
    e.preventDefault();
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth();
    let yyyy = today.getFullYear();
    let endDate;
    let plan;
    if (e.target.plan.value === "3 months, 1 game/month") {
      endDate = new Date(yyyy, mm + 3, dd);
      plan = "3M1G";
    } else if (e.target.plan.value === "6 months, 2 games/month") {
      endDate = new Date(yyyy, mm + 6, dd);
      plan = "6M2G";
    } else if (e.target.plan.value === "1 year, 4 games/month") {
      endDate = new Date(yyyy + 1, mm, dd);
      plan = "1Y4G";
    }

    let membership = this.state.membership;
    for (let i = 0; i < membership.length; i++) {
      membership[i].active = false;
    }
    let new_membership = {
      plan: plan,
      active: true,
      start: today,
      end: endDate,
    };
    membership.push(new_membership);
    console.log(membership);

    let data = {
      membership: membership,
    };

    axios
      .post(this.props.url + "/customer/add_plan/" + this.state.id, data)
      .then((res) => {
        console.log(res.data);
        this.getPlans();
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleForm}>
          <div className="form-group">
            <select className="form-control" name="plan">
              <option>Choose a plan</option>
              <option>3 months, 1 game/month</option>
              <option>6 months, 2 games/month</option>
              <option>1 year, 4 games/month</option>
            </select>
          </div>
          <input type="submit" className="btn btn-primary" value="Add Plan" />
        </form>
      </div>
    );
  }
}

export default AddPlan;
