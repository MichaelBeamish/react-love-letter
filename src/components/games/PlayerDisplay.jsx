import React from "react";

import Points from "./Points";

const PlayerDisplay = ({ player, user, whosTurn }) => {
  if (player && user) {
    let styleForCurrentPlayer = "styleForOtherPlayers";
    if (player.id === whosTurn) {
      styleForCurrentPlayer = "styleForCurrentPlayer";
    }
    let playerColor = null;
    if (player.id === 0) {
      playerColor = "green";
    } else if (player.id === 1) {
      playerColor = "red";
    } else if (player.id === 2) {
      playerColor = "purple";
    } else {
      playerColor = "orange";
    }
    return (
      <div
        className={`center height-100 width-100 grey darken-2 ${styleForCurrentPlayer}`}
      >
        <div className="row height-100">
          <div className="playerNameDisplayContainer">
            <span className={`${playerColor} playerNameDisplay`}>
              {user.nickname.toUpperCase()}{" "}
            </span>
          </div>
          <div className="col l3 center">
            <Points points={player.roundPoints} />
            <p>Discarded: {player.totalDiscardedPoints}</p>
            <div className="playersCardsInHand">
              {player.isIn === true ? (
                <img
                  className="draw-card-img"
                  src={"/img/cardback.jpg"}
                  alt="card"
                />
              ) : (
                <div className="out-container">
                  <p>{user.firstName} is out!</p>
                  <img
                    className="skull-icon"
                    src={"/img/skull.png"}
                    alt="player-is-out"
                  />
                </div>
              )}
              {player.newCard ? (
                <img
                  className="draw-card-img"
                  src={"/img/cardback.jpg"}
                  alt="card"
                />
              ) : null}
              {player.protected === true ? (
                <div className="center">
                  <p>{user.firstName} is protected!</p>
                  <img
                    className="shield-icon"
                    src={"/img/shield.png"}
                    alt="players-turn"
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="col l9 scrollable">
            <p>Discarded Cards:</p>
            {player.discardedCards.length
              ? player.discardedCards.map((card, index) => (
                  <img
                    key={index}
                    className="disc-card-img"
                    src={"/img/" + card + ".jpg"}
                    alt={card}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    );
  } else {
    return <span>loading player...</span>;
  }
};

export default PlayerDisplay;
