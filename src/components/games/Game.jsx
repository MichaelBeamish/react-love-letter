import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import moment from "moment";

import { connect } from "react-redux"; //Connects redux store to component.
import { firestoreConnect } from "react-redux-firebase"; //Connects firestore to redux store.
import { compose } from "redux";

//COMPONENTS:
import TwoPlayer from "./TwoPlayer";
import ThreePlayer from "./ThreePlayer";
import FourPlayer from "./FourPlayer";
import YourHand from "./YourHand";
import FaceDownBurns from "./FaceDownBurns";
import FaceUpBurns from "./FaceUpBurns";
import DrawPile from "./DrawPile";
import PriorPlay from "./PriorPlay";

//ACTIONS:
import { playerReadyForNextRound } from "../../store/actions/gameActions";

class Game extends Component {
  state = {
    priestVictimID: null,
    priestVictimNickname: null,
    victimCardAtTime: null,
    victimStyleClass: null
  };

  priestPlayed = victim => {
    if (this.state.priestVictimID === null) {
      //ADD LOGIC FOR PLAYER ACROSS AND TO RIGHT.
      if (this.props.playerToLeft) {
        if (victim === this.props.playerToLeft.id) {
          this.setState({
            victimCardAtTime: JSON.parse(
              JSON.stringify(this.props.playerToLeft.cardInHand)
            ),
            victimStyleClass: "overLay-TL",
            priestVictimNickname: this.props.playerToLeftInfo.nickname
          });
        }
      }
      if (this.props.playerAcross) {
        if (this.props.numberOfPlayers === 2) {
          if (victim === this.props.playerAcross.id) {
            this.setState({
              victimCardAtTime: JSON.parse(
                JSON.stringify(this.props.playerAcross.cardInHand)
              ),
              victimStyleClass: "overLay-AC2",
              priestVictimNickname: this.props.playerAcrossInfo.nickname
            });
          }
        } else {
          if (victim === this.props.playerAcross.id) {
            this.setState({
              victimCardAtTime: JSON.parse(
                JSON.stringify(this.props.playerAcross.cardInHand)
              ),
              victimStyleClass: "overLay-AC",
              priestVictimNickname: this.props.playerAcrossInfo.nickname
            });
          }
        }
      }
      if (this.props.playerToRight) {
        if (this.props.numberOfPlayers === 3) {
          if (victim === this.props.playerToRight.id) {
            this.setState({
              victimCardAtTime: JSON.parse(
                JSON.stringify(this.props.playerToRight.cardInHand)
              ),
              victimStyleClass: "overLay-AC",
              priestVictimNickname: this.props.playerToRightInfo.nickname
            });
          }
        } else {
          if (victim === this.props.playerToRight.id) {
            this.setState({
              victimCardAtTime: JSON.parse(
                JSON.stringify(this.props.playerToRight.cardInHand)
              ),
              victimStyleClass: "overLay-TR",
              priestVictimNickname: this.props.playerToRightInfo.nickname
            });
          }
        }
      }

      this.setState({
        priestVictimID: victim
      });
    }
  };

  priestViewed = () => {
    this.setState({
      priestVictimID: null
    });
  };

  render() {
    const {
      auth,
      gameID,
      game,
      users,
      numberOfPlayers,
      thisPlayer,
      thisPlayerInfo,
      playerToLeft,
      playerToLeftInfo,
      playerToRight,
      playerToRightInfo,
      playerAcross,
      playerAcrossInfo,
      generateNewRound,
      playerReadyForNextRound
    } = this.props;

    //AUTHENTICATION:
    if (!auth.uid) {
      console.log("Not logged in.");
      return <Redirect to="/splash" />; //If not logged in redirect.
    }
    if (game) {
      let userIsAuthorized = false;
      game.players.forEach(player => {
        if (player.userReference === auth.uid) {
          userIsAuthorized = true;
        }
      });
      if (userIsAuthorized === false) {
        console.log("Not a member of this game.");
        return <Redirect to="/" />; //If user is not part of game redirect.
      }
    }

    //GAME VIEW:
    if (game && users) {
      let otherPlayers = null;
      if (numberOfPlayers === 2) {
        otherPlayers = (
          <TwoPlayer
            whosTurn={game.whosTurn}
            thisPlayer={thisPlayer}
            thisPlayerInfo={thisPlayerInfo}
            playerAcross={playerAcross}
            playerAcrossInfo={playerAcrossInfo}
          />
        );
      } else if (numberOfPlayers === 3) {
        otherPlayers = (
          <ThreePlayer
            whosTurn={game.whosTurn}
            thisPlayer={thisPlayer}
            thisPlayerInfo={thisPlayerInfo}
            playerToLeft={playerToLeft}
            playerToLeftInfo={playerToLeftInfo}
            playerToRight={playerToRight}
            playerToRightInfo={playerToRightInfo}
          />
        );
      } else {
        otherPlayers = (
          <FourPlayer
            whosTurn={game.whosTurn}
            thisPlayer={thisPlayer}
            thisPlayerInfo={thisPlayerInfo}
            playerToLeft={playerToLeft}
            playerToLeftInfo={playerToLeftInfo}
            playerAcross={playerAcross}
            playerAcrossInfo={playerAcrossInfo}
            playerToRight={playerToRight}
            playerToRightInfo={playerToRightInfo}
          />
        );
      }

      //GET WINNING USER:
      let winningUser;
      if (game && users && game.status === "roundOver") {
        let winningPlayer = game.players.find(
          player => player.id === game.roundWinner
        );
        winningUser = users.find(
          user => user.id === winningPlayer.userReference
        );
      }

      //GET ALL USERS READY STATUS:
      let readyUsers = [];
      let notReadyUsers = [];
      game.players.forEach(player => {
        if (player.isReadyForNextRound === true) {
          users.forEach(user => {
            if (user.id === player.userReference) {
              readyUsers.push(<div key={user.nickname}>{user.nickname}</div>);
            }
          });
        } else {
          users.forEach(user => {
            if (user.id === player.userReference) {
              notReadyUsers.push(
                <div key={user.nickname}>{user.nickname}</div>
              );
            }
          });
        }
      });

      if (game && users) {
        if (game.status === "gameOver") {
          let winningPlayer = game.players.find(
            player => player.id === game.overallWinner
          );
          winningUser = users.find(
            user => user.id === winningPlayer.userReference
          );
        }
      }

      return (
        <div className="main-height noScroll">
          <div className="row height-100">
            <div className="col l2 m2 blue darken-2 height-100 left-col scrollable">
              <div className="center border-bottom">
                <h5>
                  <b>{game.gameName.toUpperCase()}</b>
                </h5>
                <b>Round: {game.round}</b>
                <br />
                <small>
                  <i>Began {moment(game.createdAt.toDate()).calendar()}</i>
                </small>
              </div>
              <YourHand
                cardInHand={thisPlayer.cardInHand}
                newCard={thisPlayer.newCard}
                thisPlayer={thisPlayer}
                gameID={gameID}
                game={game}
                users={users}
                priestPlayed={this.priestPlayed}
              />
            </div>
            <div className="col l8 m8 grey darken-4 height-100 v-center width-100 zero-mp">
              {otherPlayers}
            </div>

            <div className="col l2 m2 blue darken-2 height-100 right-col scrollable width-100 zero-mp">
              <p className="center">
                <b>Burn Cards:</b>
              </p>
              {game.faceUpBurnCards.length ? (
                <FaceUpBurns faceUpBurnCards={game.faceUpBurnCards} />
              ) : null}
              {game.faceDownBurnCards.length ? (
                <FaceDownBurns faceDownBurnCards={game.faceDownBurnCards} />
              ) : null}
              <p className="center">
                <b>Draw Pile:</b>
                <br />({game.drawPile.length} cards left)
              </p>
              <DrawPile drawPile={game.drawPile} />
              <div className="prior-plays-container">
                <p className="white-text">
                  <b>Prior Plays:</b>
                  <small className="right"> (most recent on top)</small>
                </p>
                {thisPlayer
                  ? thisPlayer.personalizedPriorPlays.map((prior, index) => (
                      <PriorPlay key={index} prior={prior} />
                    ))
                  : null}
              </div>
            </div>
          </div>
          <div id="All THINGS WITH ABSOLUTE POSITIONS">
            {this.state.priestVictimID !== null ? (
              <div className={this.state.victimStyleClass}>
                <div className="center personal-visual">
                  <h6 className="personal-visual-title">
                    You saw {this.state.priestVictimNickname + "'s "}
                    {this.state.victimCardAtTime.toUpperCase()}.
                  </h6>
                  <img
                    className="overlay-card-img"
                    src={"/img/" + this.state.victimCardAtTime + ".jpg"}
                    alt={this.state.victimCardAtTime}
                  />
                  <br />
                  <button
                    className="btn btn-small blue darken-2 personal-visual-button"
                    onClick={() => this.priestViewed()}
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : null}
            {winningUser && game.status === "gameOver" ? (
              <div className="round-over-display">
                <div className="center">
                  <h1>Game Over!</h1>
                  <h2>{winningUser.nickname} won!</h2>
                </div>
              </div>
            ) : null}
            {winningUser && game.status === "roundOver" ? (
              <div className="round-over-display">
                <div className="center">
                  <h4>
                    <u>ROUND IS OVER</u>
                  </h4>
                  <h5>{winningUser.nickname} won this round.</h5>
                  {thisPlayer.isReadyForNextRound === false ? (
                    <div>
                      <p>Ready for next round?</p>
                      <button
                        onClick={() =>
                          playerReadyForNextRound(gameID, game, thisPlayer.id)
                        }
                        className="btn btn-small blue"
                      >
                        OK
                      </button>
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col l6">
                      <u>
                        <b>Not Ready:</b>
                      </u>
                      {notReadyUsers}
                    </div>
                    <div className="col l6">
                      <u>
                        <b>Ready:</b>
                      </u>
                      {readyUsers}
                    </div>
                  </div>
                  {notReadyUsers.length === 0 ? (
                    <button
                      className="btn btn-small blue"
                      onClick={() =>
                        playerReadyForNextRound(gameID, game, null)
                      }
                    >
                      Begin New Round
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    } else {
      return <p>Loading game...</p>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  //SET GAME ID:
  let gameID = ownProps.match.params.id;
  //SET GAME:
  let games = state.firestore.data.games;
  let game = games ? games[gameID] : null;
  //SET THIS PLAYER:
  let thisUserID = state.firebase.auth.uid;
  let thisPlayer = games
    ? game.players.find(player => {
        return player.userReference === thisUserID;
      })
    : null;
  //SET OTHER PLAYERS:
  let numberOfPlayers = games ? game.players.length : null;
  let playerToLeft = 0;
  let playerAcross = 0;
  let playerToRight = 0;
  //FOUR PLAYER GAME:
  if (numberOfPlayers === 4) {
    let currentID = thisPlayer.id + 1;
    for (let i = 3; i > 0; i--) {
      if (currentID === 4) {
        currentID = 0;
      }
      if (i === 3) {
        playerToLeft = currentID;
      } else if (i === 2) {
        playerAcross = currentID;
      } else {
        playerToRight = currentID;
      }
      currentID++;
    }
    playerToLeft = game.players.find(player => player.id === playerToLeft);
    playerToRight = game.players.find(player => player.id === playerToRight);
    playerAcross = game.players.find(player => player.id === playerAcross);
  }
  //THREE PLAYER GAME:
  if (numberOfPlayers === 3) {
    let currentID = thisPlayer.id + 1;
    for (let i = 2; i > 0; i--) {
      if (currentID === 3) {
        currentID = 0;
      }
      if (i === 2) {
        playerToLeft = currentID;
      } else {
        playerToRight = currentID;
      }
      currentID++;
    }
    playerToLeft = game.players.find(player => player.id === playerToLeft);
    playerToRight = game.players.find(player => player.id === playerToRight);
    playerAcross = null;
  }
  //TWO PLAYER GAME:
  if (numberOfPlayers === 2) {
    let currentID = thisPlayer.id + 1;
    for (let i = 1; i > 0; i--) {
      if (currentID === 2) {
        currentID = 0;
      }
      if (i === 1) {
        playerAcross = currentID;
      }
      currentID++;
    }
    playerToLeft = null;
    playerToRight = null;
    playerAcross = game.players.find(player => player.id === playerAcross);
  }

  //SET USERS INFO:
  let retreivedUsers = state.firestore.ordered.users;
  let users = retreivedUsers ? retreivedUsers : null;
  let playerToLeftInfo = null;
  let playerToRightInfo = null;
  let playerAcrossInfo = null;
  let thisPlayerInfo = null;
  if (game && users) {
    if (playerToLeft) {
      playerToLeftInfo = users.find(
        user => user.id === playerToLeft.userReference
      );
    }
    if (playerToRight) {
      playerToRightInfo = users.find(
        user => user.id === playerToRight.userReference
      );
    }
    if (playerAcross) {
      playerAcrossInfo = users.find(
        user => user.id === playerAcross.userReference
      );
    }
    if (thisPlayer) {
      thisPlayerInfo = users.find(user => user.id === thisPlayer.userReference);
    }
  }

  return {
    auth: state.firebase.auth,
    game: game,
    gameID: gameID,
    users: users,
    numberOfPlayers: numberOfPlayers,
    thisPlayer: thisPlayer,
    thisPlayerInfo: thisPlayerInfo,
    playerToLeft: playerToLeft,
    playerToLeftInfo: playerToLeftInfo,
    playerToRight: playerToRight,
    playerToRightInfo: playerToRightInfo,
    playerAcross: playerAcross,
    playerAcrossInfo: playerAcrossInfo
  };
};

export default compose(
  connect(
    mapStateToProps,
    { playerReadyForNextRound }
  ),
  firestoreConnect([{ collection: "users" }, { collection: "games" }])
)(Game);
