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
        className={`${playerColor} center height-100 width-100 ${styleForCurrentPlayer}`}
      >
        <div className="row height-100">
          <div className="row">
            <div className="col l12">
              <h5>
                <b>{user.nickname.toUpperCase()}</b>
              </h5>
            </div>
          </div>
          <div className="col l4 center">
            <Points points={player.roundPoints} />
            <div className="playersCardsInHand">
              {player.isIn === true ? (
                <img
                  className="side-card-img"
                  src={"/img/cardback.jpg"}
                  alt="card"
                />
              ) : (
                <div className="center">
                  <img
                    className="skull-icon"
                    src={"/img/skull.png"}
                    alt="player-is-out"
                  />
                  <br />
                  <b>{user.firstName} is out!</b>
                </div>
              )}
              {player.newCard ? (
                <img
                  className="side-card-img"
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
          <div className="col l8 discarded-cards">
            <b>Discarded Cards:</b>
            <br />
            <small>
              Total Value Of Discarded Cards: {player.totalDiscardedPoints}
            </small>
            <br />
            <br />
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
