import React, { Component } from "react";
import CustomerForm from "./customerForm";
import axios from "axios";
import { Redirect } from "react-router-dom";

class UpdateCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      name: "",
      email: "",
      address: "",
      address2: "",
      city: "",
      zip: "",
      mobile_no: "",
      alt_mobile_no: "",
      membership: []
    };
    this.handleForm = this.handleForm.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    axios.get("http://localhost:4000/customer/" + this.state.id).then(res => {
      this.setState({
        name: res.data.name,
        email: res.data.email,
        address: res.data.address,
        address2: res.data.address2,
        city: res.data.city,
        zip: res.data.zip,
        mobile_no: res.data.mobile_no,
        alt_mobile_no: res.data.alt_mobile_no,
        membership: res.data.membership
      });
      console.log(res.data);
    });
  }

  handleForm(e) {
    e.preventDefault();
    console.log(
      e.target.name.value,
      e.target.email.value,
      e.target.address1.value,
      e.target.address2.value,
      e.target.inputCity.value,
      e.target.inputZip.value,
      e.target.mobileNo1.value,
      e.target.mobileNo2.value
    );
    // let endDate;
    // let plan;
    // if (e.target.plan.value === "3 months, 1 game/month") {
    //   endDate = new Date(yyyy, mm + 3, dd);
    //   plan = "3M1G";
    // } else if (e.target.plan.value === "6 months, 2 games/month") {
    //   endDate = new Date(yyyy, mm + 6, dd);
    //   plan = "6M2G";
    // } else if (e.target.plan.value === "1 year, 4 games/month") {
    //   endDate = new Date(yyyy + 1, mm, dd);
    //   plan = "1Y4G";
    // }
    let customer = {
      id: this.state.id,
      name: e.target.name.value,
      email: e.target.email.value,
      address: e.target.address1.value,
      address2: e.target.address2.value,
      city: e.target.inputCity.value,
      zip: e.target.inputZip.value,
      mobile_no: e.target.mobileNo1.value,
      alt_mobile_no: e.target.mobileNo1.value
    };

    axios
      .post(
        "http://localhost:4000/customer/update/5d258ceaf2b28324283a7d5c",
        customer
      )
      .then(res => {
        console.log(res.data);
        this.setRedirect();
      })
      .catch(err => {
        console.log(err);
      });
    // console.log(customer);
  }

  setRedirect = () => {
    console.log("Test");
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/customer/" + this.state.id} />;
    }
  };
  render() {
    console.log(this.state.id);
    return (
      <div>
        {this.renderRedirect()}
        <CustomerForm
          mode="edit"
          onSubmit={this.handleForm}
          name={this.state.name}
          email={this.state.email}
          address={this.state.address}
          address2={this.state.address2}
          city={this.state.city}
          zip={this.state.zip}
          mobile_no={this.state.mobile_no}
          alt_mobile_no={this.state.alt_mobile_no}
        />
      </div>
    );
  }
}
// mode: "Update this Customer",
//         name: props.name,
//         email: props.email,
//         address: props.address,
//         address2: props.address2,
//         city: props.city,
//         zip: props.zip,
//         mobile_no: props.mobile_no,
//         alt_mobile_no: props.alt_mobile_no,
//         show: false

export default UpdateCustomer;
