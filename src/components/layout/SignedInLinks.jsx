import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

const SignedInLinks = props => {
  return (
    <ul className="right">
      <li>
        <NavLink to="/" onClick={props.signOut}>
          Log Out
        </NavLink>
      </li>
      <li>
        <NavLink to="/" className="btn btn-floating green darken-1">
          {props.profile.initials}
        </NavLink>
      </li>
    </ul>
  );
};

export default connect(
  null,
  { signOut }
)(SignedInLinks);
