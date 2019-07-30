import React, { Component } from "react";

class CustomerForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    if (props.mode === "add") {
      this.state = {
        mode: "Add Customer",
        name: "",
        email: "",
        address: "",
        address2: "",
        city: "",
        zip: "",
        mobile_no: "",
        alt_mobile_no: "",
        show: true
      };
    }
    if (props.mode === "edit") {
      this.state = {
        mode: "Update this Customer",
        name: props.name,
        email: props.email,
        address: props.address,
        address2: props.address2,
        city: props.city,
        zip: props.zip,
        mobile_no: props.mobile_no,
        alt_mobile_no: props.alt_mobile_no,
        show: false
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      email: nextProps.email,
      address: nextProps.address,
      address2: nextProps.address2,
      city: nextProps.city,
      zip: nextProps.zip,
      mobile_no: nextProps.mobile_no,
      alt_mobile_no: nextProps.alt_mobile_no
    });
  }
  render() {
    const plan = this.state.show ? (
      <div className="form-group">
        <select className="form-control" name="plan" required>
          <option value="" selected disabled hidden>
            Choose a plan
          </option>
          <option>3 months, 1 game/month</option>
          <option>6 months, 2 games/month</option>
          <option>1 year, 4 games/month</option>
        </select>
      </div>
    ) : (
      <div />
    );
    return (
      <div>
        <form onSubmit={this.props.onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-5">
              <label for="inputEmail4">Name</label>
              <input
                name="name"
                className="form-control"
                id="inputEmail4"
                placeholder="Name"
                defaultValue={this.state.name}
                required
              />
            </div>
            <div className="form-group col-md-5">
              <label for="inputPassword4">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="inputPassword4"
                placeholder="Email"
                defaultValue={this.state.email}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label for="inputAddress">Address</label>
            <input
              type="text"
              name="address1"
              className="form-control"
              id="inputAddress"
              placeholder="1234 Main St"
              defaultValue={this.state.address}
            />
          </div>
          <div className="form-group">
            <label for="inputAddress2">Address 2</label>
            <input
              type="text"
              name="address2"
              className="form-control"
              id="inputAddress2"
              placeholder="Apartment, studio, or floor"
              defaultValue={this.state.address2}
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-5">
              <label for="inputCity">City</label>
              <input
                type="text"
                className="form-control"
                name="inputCity"
                defaultValue={this.state.city}
              />
            </div>
            <div className="form-group col-md-2">
              <label for="inputZip">Pincode </label>
              <input
                type="text"
                className="form-control"
                name="inputZip"
                defaultValue={this.state.zip}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label for="inputCity">Mobile no.</label>
              <input
                type="text"
                className="form-control"
                name="mobileNo1"
                defaultValue={this.state.mobile_no}
              />
            </div>
            <div className="form-group col-md-6">
              <label for="inputState">Alternate Mobile no.</label>
              <input
                type="text"
                className="form-control"
                name="mobileNo2"
                defaultValue={this.state.alt_mobile_no}
              />
            </div>
          </div>

          {plan}
          <div className="form-group">
            <input
              type="submit"
              value={this.state.mode}
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default CustomerForm;
