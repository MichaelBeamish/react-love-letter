import React from "react";

const FaceUpBurns = ({ faceUpBurnCards }) => {
  let burnCardsList = faceUpBurnCards.map((card, index) => (
    <img
      key={index}
      className="side-card-img"
      src={"/img/" + card + ".jpg"}
      alt={"burncard-" + card}
    />
  ));
  return <div className="center">{burnCardsList}</div>;
};

export default FaceUpBurns;
