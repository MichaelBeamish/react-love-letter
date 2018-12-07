import React from "react";
import { NavLink } from "react-router-dom";

import moment from "moment";

const GameSummary = ({ game, id }) => {
  //GENERATE DATE/TIME:
  let utcSeconds = game.createdAt.seconds;
  let utcMilliseconds = game.createdAt.nanoseconds / 1000000;
  let date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  date.setUTCMilliseconds(utcMilliseconds);

  if (game) {
    return (
      <div className="col l6">
        <div className=" game-summary">
          <h4 className="center">{game.gameName.toUpperCase()}</h4>
          <NavLink to={"/game/" + game.id}>
            <button className="btn green darken-2">Load Game</button>
          </NavLink>
        </div>
      </div>
    );
  }
};

export default GameSummary;
