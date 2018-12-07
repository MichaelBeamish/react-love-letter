import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { connect } from "react-redux"; //Connects redux store to component.
import { firestoreConnect } from "react-redux-firebase"; //Connects firestore to redux store.
import { compose } from "redux";

import { Redirect } from "react-router-dom";

import GameSummary from "./GameSummary";

class Home extends Component {
  render() {
    const { auth, profile, games, users } = this.props;
    let newGames;
    if (games) {
      newGames = JSON.parse(JSON.stringify(games));
    }
    let yourGames = [];
    if (games && users) {
      newGames.forEach(game => {
        game.players.forEach(player => {
          if (player.userReference === auth.uid) {
            let gameObject = game;
            gameObject.players.forEach(player => {
              if (player.userReference === auth.uid) {
                let thisUser = users.filter(
                  user => user.id === player.userReference
                );
                gameObject.thisUser = thisUser[0];
              } else {
                let otherUser = users.filter(
                  user => user.id === player.userReference
                );
                gameObject.otherUser = otherUser[0];
              }
            });
            yourGames.push(gameObject);
          }
        });
      });
    }

    if (!auth.uid) return <Redirect to="/splash" />; //If not logged in redirect.
    return (
      <div>
        <h1 className="center">
          Welcome
          {profile.firstName !== undefined ? " " + profile.firstName : null}!
        </h1>
        <div className="center">
          <NavLink to="/hostPrivateGame">
            <button className="btn orange">Create New Game</button>
          </NavLink>
        </div>
        <div className="row container games-container">
          {yourGames.length > 0 &&
            users &&
            yourGames.map(game => {
              return <GameSummary key={game.id} game={game} id={auth.uid} />;
            })}
          {yourGames.length === 0 ? (
            <div>You currently have no games.</div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    games: state.firestore.ordered.games,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "users" }, { collection: "games" }])
)(Home);
