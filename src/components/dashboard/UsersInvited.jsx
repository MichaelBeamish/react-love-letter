import React from "react";

const UsersInvited = ({ auth, users, removePlayerFromGame, playersAdded }) => {
  let listOfPlayersAdded = [];
  if (users) {
    playersAdded.forEach(player => {
      users.forEach(user => {
        if (player === user.id && player === auth.uid) {
          listOfPlayersAdded.push(
            <tr key={user.id}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td />
            </tr>
          );
        } else if (player === user.id) {
          listOfPlayersAdded.push(
            <tr key={user.id}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => {
                    removePlayerFromGame(user.id);
                  }}
                  className="btn red"
                >
                  Remove
                </button>
              </td>
            </tr>
          );
        }
      });
    });
  } else {
    listOfPlayersAdded = (
      <tr>
        <td>Loading players...</td>
      </tr>
    );
  }
  return (
    <div>
      <h4>Current Players</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Nickname</th>
            <th>Email</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>{listOfPlayersAdded}</tbody>
      </table>
    </div>
  );
};

export default UsersInvited;
