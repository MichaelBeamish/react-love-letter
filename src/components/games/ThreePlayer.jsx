import React from "react";

import PlayerDisplay from "./PlayerDisplay";

const FourPlayer = ({
  whosTurn,
  thisPlayer,
  thisPlayerInfo,
  playerToLeft,
  playerToLeftInfo,
  playerToRight,
  playerToRightInfo
}) => {
  if (thisPlayerInfo && playerToLeftInfo && playerToRightInfo) {
    return (
      <div className="width-100 height-100">
        <div className="row height-50 width-100 zero-mp">
          <div className="col l6 height-100 valign-wrapper width-100 zero-mp">
            <PlayerDisplay
              player={playerToLeft}
              user={playerToLeftInfo}
              whosTurn={whosTurn}
            />
          </div>
          <div className="col l6 height-100 valign-wrapper width-100 zero-mp">
            <PlayerDisplay
              player={playerToRight}
              user={playerToRightInfo}
              whosTurn={whosTurn}
            />
          </div>
        </div>
        <div className="row height-50 width-100 zero-mp">
          <div className="col l12 height-100 valign-wrapper width-100 zero-mp">
            <PlayerDisplay
              player={thisPlayer}
              user={thisPlayerInfo}
              whosTurn={whosTurn}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading users...</p>;
  }
};

export default FourPlayer;
