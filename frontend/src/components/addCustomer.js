import React, { Component } from "react";
import CustomerForm from "./customerForm";
import axios from "axios";

class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.handleForm = this.handleForm.bind(this);
  }

  handleForm(e) {
    e.preventDefault();
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth();
    let yyyy = today.getFullYear();

    console.log(
      e.target.name.value,
      e.target.email.value,
      e.target.address1.value,
      e.target.address2.value,
      e.target.inputCity.value,
      e.target.inputZip.value,
      e.target.mobileNo1.value,
      e.target.mobileNo2.value,
      e.target.plan.value
    );
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

    let customer = {
      name: e.target.name.value,
      email: e.target.email.value,
      address: e.target.address1.value,
      address2: e.target.address2.value,
      city: e.target.inputCity.value,
      zip: e.target.inputZip.value,
      mobile_no: e.target.mobileNo1.value,
      alt_mobile_no: e.target.mobileNo1.value,
      dateOfJoin: today,
      membership: [{ plan: plan, start: today, end: endDate, active: true }]
    };
    console.log(customer);

    axios
      .post("http://localhost:4000/customer/add", customer)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          status: "An Error has occured, check console log."
        });
      });
  }
  render() {
    return <CustomerForm mode="add" onSubmit={this.handleForm} />;
  }
}

export default AddCustomer;
