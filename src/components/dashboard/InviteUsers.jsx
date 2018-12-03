import React, { Component } from "react";
import InviteButton from "./InviteButton";

class InviteUsers extends Component {
  state = {
    searchBar: ""
  };
  handleChange = e => {
    let { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { users, addPlayerToGame, players } = this.props;
    let listOfUsers;
    if (users && this.state.searchBar.length) {
      listOfUsers = users
        //****FIX FILTER**** it currently wont find a player if you type full name. only first OR last name. also add ability to search by email or nickname.
        .filter(
          user =>
            user.firstName
              .toLowerCase()
              .includes(this.state.searchBar.toLowerCase()) ||
            user.lastName
              .toLowerCase()
              .includes(this.state.searchBar.toLowerCase())
        )
        .map(user => (
          <tr key={user.id}>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>{user.nickname}</td>
            <td>{user.email}</td>
            <td>
              <InviteButton
                addPlayerToGame={addPlayerToGame}
                user={user}
                players={players}
              />
            </td>
          </tr>
        ));
    } else {
      listOfUsers = (
        <tr>
          <td>Search for your friends above.</td>
        </tr>
      );
    }
    return (
      <div>
        <h4>Invite Friends</h4>
        <input
          className="white"
          type="text"
          name="searchBar"
          onChange={this.handleChange}
          value={this.state.searchBar}
          placeholder=" Search for friends."
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Nickname</th>
              <th>Email</th>
              <th>Invite</th>
            </tr>
          </thead>
          <tbody>{listOfUsers}</tbody>
        </table>
      </div>
    );
  }
}

export default InviteUsers;
