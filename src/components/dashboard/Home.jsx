import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { connect } from "react-redux"; //Connects redux store to component.
import { firestoreConnect } from "react-redux-firebase"; //Connects firestore to redux store.
import { compose } from "redux";

import { Redirect } from "react-router-dom";

import moment from "moment";

class Home extends Component {
  render() {
    const { auth, profile, games } = this.props;
    let yourGames = [];
    if (games) {
      games.forEach(game => {
        game.players.forEach(player => {
          if (player.userReference === auth.uid) {
            yourGames.push(game);
          }
        });
      });
    }

    if (!auth.uid) return <Redirect to="/splash" />; //If not logged in redirect.
    return (
      <div className="container">
        <h1 className="center">Welcome {profile.firstName}!</h1>
        <div className="center">
          <NavLink to="/hostPrivateGame">
            <button className="btn green">Host Private Game</button>
          </NavLink>
        </div>
        <div>
          <h3>Your Current Games</h3>
          {yourGames.length > 0 &&
            yourGames.map(game => {
              return (
                <div key={game.id} className="game-bubble">
                  <NavLink to={"/game/" + game.id}>
                    <h5>{game.gameName.toUpperCase()}</h5>
                  </NavLink>
                  <p>Started {moment(game.createdAt.toDate()).calendar()}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    games: state.firestore.ordered.games,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "games" }])
)(Home);
