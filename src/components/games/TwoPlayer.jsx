import React from "react";

const TwoPlayer = ({ playerAcross }) => {
  return (
    <div>
      <h4>Two Player Game</h4>
      <p>ACROSS: {playerAcross.userReference}</p>
    </div>
  );
};

export default TwoPlayer;
