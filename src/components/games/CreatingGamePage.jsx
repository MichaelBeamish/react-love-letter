import React from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux"; //Connects redux store to component.
import { firestoreConnect } from "react-redux-firebase"; //Connects firestore to redux store.
import { compose } from "redux";

//Actions:
import { createdToNull } from "../../store/actions/gameActions";

const CreatingGamePage = ({ gameID, game, gameInfo, createdToNull }) => {
  //Revert redux state game ID to null. (if this didn't happen every time you clicked the create new game it would redirect you to the last game page you created.)
  if (gameInfo.gameCreatedID !== null) {
    createdToNull();
  }

  //REDIRECT TO GAME PAGE IF CREATED:
  if (game !== undefined && game !== null)
    return <Redirect to={"/game/" + gameID} />;

  return (
    <div className="blue loading-game">
      <p>Loading game...</p>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  //SET GAME ID:
  let gameID = ownProps.match.params.id;
  let games = state.firestore.data.games;
  let game = games ? games[gameID] : null;
  return {
    gameID: gameID,
    game: game,
    gameInfo: state.gameReducer
  };
};

export default compose(
  connect(
    mapStateToProps,
    { createdToNull }
  ),
  firestoreConnect([{ collection: "games" }])
)(CreatingGamePage);
