import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";
import LoadingSpinner from "./loadingSpinner";
import Toast from "react-bootstrap/Toast";

class Login extends Component {
  constructor(props) {
    super(props);
    localStorage.removeItem("isLoggedIn");
    this.state = {
      email: "",
      password: "",
      redirect: false,
      login_validating: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
  }
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };
  handleLogin(e) {
    e.preventDefault();
    this.setState({ login_validating: true });
    axios
      .post(this.props.url + "/login/", {
        email: e.target.email.value,
        password: e.target.password.value,
      })
      .then((res) => {
        if (!res.data.isLoggedIn) {
          alert("Wrong Password");
        } else {
          localStorage.setItem("isLoggedIn", res.data.isLoggedIn);
          this.setState({
            redirect: true,
          });
          this.props.onSubmit();
        }
        this.setState({ login_validating: false });
      });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={"/"} />;
    }
  };
  render() {
    return (
      <div className="Login" style={{ margin: "1em" }}>
        {this.renderRedirect()}
        <h1 style={{ textAlign: "center" }}>Login to Continue</h1>
        <form onSubmit={this.handleLogin}>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          {this.state.login_validating ? (
            <Button block bsSize="large" disabled>
              <LoadingSpinner></LoadingSpinner>
            </Button>
          ) : (
            <Button
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
              Login
            </Button>
          )}
          <Toast style={{ margin: "1em" }}>
            <Toast.Body>
              Email: prayuj@gmail.com<br></br>Password: hello
            </Toast.Body>
          </Toast>
        </form>
      </div>
    );
  }
}

export default Login;
