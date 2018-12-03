import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/actions/authActions";

class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    passwordsMatch: false
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
    if (e.target.id === "password") {
      if (this.state.passwordConfirmation !== e.target.value) {
        this.setState({
          passwordsMatch: true
        });
      } else {
        this.setState({
          passwordsMatch: false
        });
      }
    }
    if (e.target.id === "passwordConfirmation") {
      if (this.state.password !== e.target.value) {
        this.setState({
          passwordsMatch: true
        });
      } else {
        this.setState({
          passwordsMatch: false
        });
      }
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.password === this.state.passwordConfirmation) {
      this.props.signUp(this.state);
    }
  };
  render() {
    const { authError, auth } = this.props;
    const passMessage = this.state.passwordsMatch
      ? "Passwords don't match."
      : null;
    if (auth.uid) return <Redirect to="/" />; //If not logged in redirect to sign in route.
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Sign Up</h5>
          <div className="input-field">
            <label htmlFor="firstName">first name</label>
            <input
              type="text"
              id="firstName"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="lastName">last name</label>
            <input
              type="text"
              id="lastName"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="nickname">nickname</label>
            <input
              type="text"
              id="nickname"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="passwordConfirmation">confirm password</label>
            <input
              type="password"
              id="passwordConfirmation"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-field">
            <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
            <div className="red-text center">
              {authError ? <p>{authError}</p> : null}
              <br />
              {passMessage}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { authError: state.auth.authError, auth: state.firebase.auth };
};

export default connect(
  mapStateToProps,
  { signUp }
)(SignUp);
