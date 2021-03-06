import React, { Component } from "react";
import { connect } from "react-redux"; //Connects redux store to component.

//Actions:
import { playCard } from "../../store/actions/cardActions";

class CardButtons extends Component {
  state = {
    guardButtonShow: false,
    whoSelectedForGuard: null
  };

  guardButtonClicked = guessedPlayerID => {
    if (this.state.guardButtonShow === false) {
      this.setState({
        guardButtonShow: true,
        whoSelectedForGuard: guessedPlayerID
      });
    } else {
      this.setState({
        guardButtonShow: false,
        whoSelectedForGuard: null
      });
    }
  };
  guardButtonShowToFalse = () => {
    this.setState({
      guardButtonShow: false,
      whoSelectedForGuard: null
    });
  };

  render() {
    const {
      gameID,
      game,
      card,
      cardPicked,
      thisPlayer,
      users,
      priestPlayed
    } = this.props;

    let attackablePlayers = [];
    let thisPlayerID = thisPlayer.id;
    let buttonList = [];
    let colors = { 0: "green", 1: "red", 2: "purple", 3: "orange" };

    game.players.forEach(player => {
      if (
        player.protected === false &&
        player.isIn === true &&
        player.id !== thisPlayerID
      ) {
        attackablePlayers.push(player);
      }
    });

    //HANDMAID
    if (card === "handmaid") {
      attackablePlayers = [thisPlayer];
    }
    //PRINCE
    if (card === "prince") {
      attackablePlayers.push(thisPlayer);
    }
    //COUNTESS
    if (card === "countess") {
      attackablePlayers = [];
    }
    if (card === "prince" || card === "king") {
      if (
        thisPlayer.cardInHand === "countess" ||
        thisPlayer.newCard === "countess"
      ) {
        return (
          <button className="btn btn-small black play-button">
            <small>Must Discard The Countess</small>
          </button>
        );
      }
    }
    //Princess
    if (card === "princess") {
      return (
        <button className="btn btn-small black play-button">
          <span className="complete-center">
            <small>Can't discard.</small>
          </span>
        </button>
      );
    }

    attackablePlayers.forEach(player => {
      let playerColor = colors[player.id];
      let user = users.find(user => user.id === player.userReference);

      //IF THE CARD IS A GUARD WE SHOULD PROVIDE GUESS OPTIONS.
      if (card === "guard") {
        buttonList.push(
          <button
            onClick={() => {
              this.guardButtonClicked(player.id);
            }}
            key={player.id}
            className={`btn btn-small ${playerColor} play-button`}
          >
            <small className="center">{user.nickname} ▼</small>
          </button>
        );
      } else {
        //FOR ALL CARDS BUT THE GUARD RETURN BUTTONS THAT IMMEDIATELY DISPATCH AN ACTION.
        buttonList.push(
          <button
            onClick={() => {
              if (card === "priest") {
                priestPlayed(player.id);
              }
              this.guardButtonShowToFalse();
              this.props.playCard(
                gameID, //Game ID.
                game, //Game Object.
                users, //All users.
                thisPlayerID, //This player ID.
                player.id, //Other player ID.
                card, //Card string. e.g.'king'
                cardPicked, //'cardInHand' or 'newCard'.
                null //Guessed card string.
              );
            }}
            key={player.id}
            className={`btn btn-small ${playerColor} play-button`}
          >
            {player.id === thisPlayerID ? (
              <div>
                {card === "handmaid" ? (
                  <span className="complete-center">
                    <img
                      className="btn-shield-icon margin-right-2"
                      src={"/img/shield.png"}
                      alt="protection"
                    />
                    <small> Protection </small>
                    <img
                      className="btn-shield-icon margin-left-2"
                      src={"/img/shield.png"}
                      alt="protection"
                    />
                  </span>
                ) : (
                  <small>{user.nickname} (you)</small>
                )}
              </div>
            ) : (
              <small>{user.nickname}</small>
            )}
          </button>
        );
      }
    });

    if (card === "guard" && this.state.guardButtonShow === true) {
      buttonList = [];
      buttonList.push(
        <button
          onClick={() => {
            this.guardButtonShowToFalse();
          }}
          key={"back"}
          className={`btn btn-small black play-button`}
        >
          <small>Back</small>
        </button>
      );
      let guessOptions = [
        "priest",
        "baron",
        "handmaid",
        "prince",
        "king",
        "countess",
        "princess"
      ];
      let guardedplayer = game.players.find(
        player => player.id === this.state.whoSelectedForGuard
      );
      let guardedUser = users.find(
        user => user.id === guardedplayer.userReference
      );
      let guardedColor = colors[guardedplayer.id];
      guessOptions.forEach(option => {
        buttonList.push(
          <button
            onClick={() => {
              this.guardButtonShowToFalse();
              this.props.playCard(
                gameID, //Game ID.
                game, //Game Object.
                users, //All users.
                thisPlayerID, //This player ID.
                guardedplayer.id, //Other player ID.
                card, //Card string. e.g.'king'
                cardPicked, //'cardInHand' or 'newCard'.
                option //Guessed card string.
              );
              // this.props.playCard(gameID, game, thisPlayer.id, otherPlayer.id, card, isItCardInHand or newCard? );
            }}
            key={thisPlayerID + option}
            className={`btn btn-small ${guardedColor} play-button`}
          >
            <small>{option}</small>
          </button>
        );
      });
    }

    //If there still isn't anybody to play on, discarding becomes an option.
    if (attackablePlayers.length === 0) {
      buttonList.push(
        <button
          onClick={() => {
            this.guardButtonShowToFalse();
            this.props.playCard(
              gameID, //Game ID.
              game, //Game Object.
              users, //All users.
              thisPlayerID, //This player ID.
              thisPlayerID, //Also this player ID.
              card, //Card string. e.g.'king'
              cardPicked, //'cardInHand' or 'newCard'.
              null //Guessed card string.
            );
          }}
          key={thisPlayerID}
          className={`btn btn-small black play-button`}
        >
          <small>Discard {card}</small>
          {card !== "countess" ? <small> (no effects)</small> : null}
        </button>
      );
    }

    //ERROR CATCH
    if (buttonList.length === 0) {
      return <button className="btn btn-small black">ERROR</button>;
    } else {
      return <div className="buttons">{buttonList}</div>;
    }
  }
}

export default connect(
  null,
  { playCard }
)(CardButtons);
