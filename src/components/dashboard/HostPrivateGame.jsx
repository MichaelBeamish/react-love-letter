import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux"; //Connects redux store to component.
import { firestoreConnect } from "react-redux-firebase"; //Connects firestore to redux store.
import { compose } from "redux";

//COMPONENTS:
import InviteUsers from "./InviteUsers";
import UsersInvited from "./UsersInvited";

//Actions:
import { generateGame } from "../../store/actions/gameActions";

class HostPrivateGame extends Component {
  state = {
    players: [this.props.auth.uid],
    notifications: "",
    gameName: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  addPlayerToGame = player => {
    console.log("Added player:", player);
    if (this.state.players.length < 4) {
      this.setState({
        players: [...this.state.players, player],
        notifications: ""
      });
    } else {
      this.setState({
        notifications: "Four players max."
      });
    }
  };

  removePlayerFromGame = playerID => {
    console.log("Removed player:", playerID);
    this.setState({
      players: this.state.players.filter(player => player !== playerID),
      notifications: ""
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.players.length > 1) {
      this.props.generateGame(this.state.players, this.state.gameName);
    } else {
      this.setState({
        notifications: "Two players minimum."
      });
    }
  };

  render() {
    const { users, auth, gameInfo } = this.props;
    let notifications = this.state.notifications;

    //REDIRECT TO GAME PAGE IF CREATED:
    if (gameInfo.gameCreatedID !== null) {
      return <Redirect to={"/createGame/" + gameInfo.gameCreatedID} />;
    }

    //REDIRECT IF NOT LOGGED IN:
    if (!auth.uid) return <Redirect to="/splash" />; //If not logged in redirect.
    return (
      <div className="container">
        <h3 className="center">Host Private Game</h3>
        <p className="red-text center">
          <b>{notifications}</b>
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col l10">
              <div className="input-field">
                <label htmlFor="gameName">name your game</label>
                <input
                  type="text"
                  id="gameName"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="col l2">
              <div className="center">
                <div className="input-field">
                  <button className="btn blue">Begin Game</button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col l6 m6 center">
            <div className="current-players-containers">
              <UsersInvited
                users={users}
                removePlayerFromGame={this.removePlayerFromGame}
                playersAdded={this.state.players}
                auth={auth}
              />
            </div>
          </div>

          <div className="col l6 m6 center">
            <div className="search-invite-containers">
              <InviteUsers
                users={users}
                addPlayerToGame={this.addPlayerToGame}
                players={this.state.players}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    gameInfo: state.gameReducer
  };
};

export default compose(
  connect(
    mapStateToProps,
    { generateGame }
  ),
  firestoreConnect([{ collection: "users" }])
)(HostPrivateGame);
