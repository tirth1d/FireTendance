import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../../../Configuration";

import * as ROUTES from "../../../../constants/routes";
import * as ROLE from "../../../../constants/role";

import Banner from "../../FormBanner";
import FacSignUpBanner from "../../../../images/faculty_banner.png";
import "../../index.css";

const SignUpFacPage = () => (
  <div>
    <Banner
      banner={FacSignUpBanner}
      alt="FcaulLoginBanner"
      banner_header="Register as a Faculty"
      banner_subheader="Please Register Your Faculty Profile By Filling Below Blanks"
    />
    <SignUpFacForm />
    <SignInLink />
  </div>
);

const INITIAL_STATE = {
  fname: "",
  lname: "",
  email: "",
  accesscode: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
  isFaculty: true,
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";
const ERROR_CODE_INVALID_EMAIL = "auth/invalid-email";

const ERROR_MSG_ACCOUNT_EXISTS =
  "An account with this E-Mail address already exists. Try to login with another account instead.";
const ERROR_MSG_INVALID_EMAIL = "Invalid Email ID";

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const {
      fname,
      lname,
      email,
      accesscode,
      passwordOne,
      passwordTwo,
      isFaculty,
    } = this.state;

    const role = {};

    if (isFaculty) {
      //Usually we don't need isFaculty condition as it is always gonna be true bu i'm keeping it fot better understanding purposes.
      role[ROLE.FACULTY] = ROLE.FACULTY;
    }

    this.setState({ error: null });

    if (
      passwordOne === "" &&
      passwordTwo === "" &&
      fname === "" &&
      (lname === "") & (email === "") &&
      accesscode === ""
    ) {
      this.setState({ error: "Please Fill Everything Up Properly" });
    } else if (fname === "" || lname === "") {
      this.setState({ error: "Please Enter Your First & Last Name Properly" });
    } else if (email === "") {
      this.setState({ error: "Please Enter Your Email Address" });
    } else if (accesscode === "") {
      this.setState({ error: "Please Enter Access Code" });
    } else if (passwordOne !== passwordTwo) {
      this.setState({ error: "Passwords are not matching" });
    } else if (passwordOne === "") {
      this.setState({ error: "Please Enter Password" });
    } else {
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then((authUser) => {
          // Create a user in your Firebase realtime database
          return (
            this.props.firebase
              .user(authUser.user.uid)
              // .("(Faculty) => " + fname + " " + lname)
              .set({
                name: fname + " " + lname,
                email,
                access_code: accesscode,
                password: passwordOne,
                role,
              })
          );
        })
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
        })
        .catch((error) => {
          if (this.state.error == null) {
            if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
              error.message = ERROR_MSG_ACCOUNT_EXISTS;
              this.setState({ error: error.message });
            } else if (error.code === ERROR_CODE_INVALID_EMAIL) {
              error.message = ERROR_MSG_INVALID_EMAIL;
              this.setState({ error: error.message });
            }
          }
        });
    }

    event.preventDefault();
  };

  render() {
    const {
      fname,
      lname,
      email,
      accesscode,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div className="flex-grp flex-fila-grp">
          <div className="group fi-name">
            <input
              type="text"
              name="fname"
              className="input"
              value={fname}
              onChange={this.onChange}
            />
            <label className="placeholder">First Name</label>
          </div>
          <div className="group la-name">
            <input
              type="text"
              name="lname"
              className="input"
              value={lname}
              onChange={this.onChange}
            />
            <label className="placeholder">Last Name</label>
          </div>
        </div>
        <br />
        <div className="flex-grp">
          <div className="group">
            <input
              type="email"
              name="email"
              className="input"
              value={email}
              onChange={this.onChange}
            />
            <label className="placeholder">Email ID</label>
          </div>
          <div className="group">
            <input
              type="number"
              name="accesscode"
              className="input"
              value={accesscode}
              onChange={this.onChange}
            />
            <label className="placeholder">Access Code</label>
          </div>
        </div>
        <br />
        <div className="flex-grp">
          <div className="group">
            <input
              type="password"
              name="passwordOne"
              className="input"
              value={passwordOne}
              onChange={this.onChange}
            />
            <label className="placeholder">Password</label>
          </div>
          <div className="group">
            <input
              type="password"
              name="passwordTwo"
              className="input"
              value={passwordTwo}
              onChange={this.onChange}
            />
            <label className="placeholder">Confirm Password</label>
          </div>
        </div>

        <button type="submit" name="submit" className="SubmitBut">
          Submit
        </button>
        <div className="error-text">
          {/* {error && <p style={{ color: `#ff0000` }}>*{error.message}*</p>} */}
          {error && <p style={{ color: `#ff0000` }}>*{error}*</p>}
        </div>
      </form>
    );
  }
}

const SignInLink = () => (
  <p style={{ textAlign: `center`, marginTop: `50px` }}>
    Already have an account?{" "}
    <Link
      style={{
        textDecoration: `none`,
        color: `#0000ff`,
        fontWeight: `500`,
        marginLeft: `5px`,
      }}
      to={ROUTES.SIGN_IN}
    >
      Sign In
    </Link>
  </p>
);

const SignUpFacForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpFacPage;

export { SignUpFacForm, SignInLink };
