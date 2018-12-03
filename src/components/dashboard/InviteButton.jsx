import React from "react";

const InviteButton = ({ user, players, addPlayerToGame }) => {
  if (!players.includes(user.id)) {
    return (
      <button onClick={() => addPlayerToGame(user.id)} className="btn green">
        Invite
      </button>
    );
  } else {
    return <button className="btn red">Added</button>;
  }
};

export default InviteButton;
