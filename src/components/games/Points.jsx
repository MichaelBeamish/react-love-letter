import React from "react";

const Points = ({ points }) => {
  let pointList = [];
  for (let i = points; i > 0; i--) {
    pointList.push(
      <img key={i} className="point-icon" src="/img/cube.png" alt={"point"} />
    );
  }
  return (
    <div>
      Points: ({points})<br />
      {pointList}
    </div>
  );
};

export default Points;
