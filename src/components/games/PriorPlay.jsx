import React from "react";

const PriorPlay = ({ prior }) => {
  let priorHTML;

  if (prior.type === "play") {
    priorHTML = (
      <b>
        <p className={`${prior.color} + center`}>
          {prior.message.toUpperCase()}
        </p>
      </b>
    );
  }
  if (prior.type === "personal") {
    priorHTML = <p className="white-text">•{prior.message}</p>;
  }

  return <div>{priorHTML}</div>;
};

export default PriorPlay;
