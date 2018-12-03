import React from "react";

const ThreePlayer = ({ playerToLeft, playerToRight }) => {
  return (
    <div>
      <h4>Three Player Game</h4>
      <p>LEFT: {playerToLeft.userReference}</p>
      <p>RIGHT: {playerToRight.userReference}</p>
    </div>
  );
};

export default ThreePlayer;
