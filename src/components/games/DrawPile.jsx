import React from "react";

const DrawPile = ({ drawPile }) => {
  let drawPileList = drawPile.map((card, index) => (
    <img
      key={index}
      className="draw-card-img"
      src={"/img/cardback.jpg"}
      alt={"burn-card"}
    />
  ));
  return <div className="center">{drawPileList}</div>;
};

export default DrawPile;
