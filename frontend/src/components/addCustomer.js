import React, { Component } from "react";

class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.handleForm = this.handleForm.bind(this);
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
      e.target.mobileNo2.value,
      e.target.plan.value
    );
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleForm}>
          <div className="form-row">
            <div className="form-group col-md-5">
              <label for="inputEmail4">Name</label>
              <input
                name="name"
                className="form-control"
                id="inputEmail4"
                placeholder="Name"
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
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-5">
              <label for="inputCity">City</label>
              <input type="text" className="form-control" name="inputCity" />
            </div>
            <div className="form-group col-md-2">
              <label for="inputZip">Zip</label>
              <input type="text" className="form-control" name="inputZip" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label for="inputCity">Mobile no.</label>
              <input type="text" className="form-control" name="mobileNo1" />
            </div>
            <div className="form-group col-md-6">
              <label for="inputState">Alternate Mobile no.</label>
              <input type="text" className="form-control" name="mobileNo2" />
            </div>
          </div>
          <div className="form-group">
            <select className="form-control form-control-lg" name="plan">
              <option>Choose a plan</option>
              <option>3 months, 1 game/month</option>
              <option>6 months, 2 games/month</option>
              <option>1 year, 4 games/month</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Add Customer"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default AddCustomer;
