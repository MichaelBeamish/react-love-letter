import React, { Component } from "react";

import CardButtons from "./CardButtons";

class YourHand extends Component {
  state = { cardInHandOptionsDisplayed: false, newCardOptionsDisplayed: false };

  cardInHandClicked = () => {
    if (this.state.cardInHandOptionsDisplayed === false) {
      this.setState({
        cardInHandOptionsDisplayed: true,
        newCardOptionsDisplayed: false
      });
    } else {
      this.setState({
        cardInHandOptionsDisplayed: false
      });
    }
  };
  newCardClicked = () => {
    if (this.state.newCardOptionsDisplayed === false) {
      this.setState({
        newCardOptionsDisplayed: true,
        cardInHandOptionsDisplayed: false
      });
    } else {
      this.setState({
        newCardOptionsDisplayed: false
      });
    }
  };

  render() {
    const {
      cardInHand,
      newCard,
      game,
      gameID,
      thisPlayer,
      users,
      priestPlayed
    } = this.props;
    return (
      <div>
        <p>
          <b>Your Hand:</b>
          <small> (click card to show options)</small>
        </p>

        <div className="row center">
          {cardInHand ? (
            <span>
              <img
                onClick={() => this.cardInHandClicked()}
                className="hand-card-icon"
                src={"/img/" + cardInHand + ".jpg"}
                alt="card"
              />
            </span>
          ) : null}
          {newCard ? (
            <span>
              <img
                onClick={() => this.newCardClicked()}
                className="hand-card-icon"
                src={"/img/" + newCard + ".jpg"}
                alt="card"
              />
            </span>
          ) : null}
        </div>
        <div className="row center">
          {this.state.cardInHandOptionsDisplayed === true ? (
            <div>
              <img
                className="hand-card-img"
                src={"/img/" + cardInHand + ".jpg"}
                alt="card"
              />
            </div>
          ) : null}
          {game.whosTurn === thisPlayer.id &&
          this.state.cardInHandOptionsDisplayed === true ? (
            <CardButtons
              gameID={gameID}
              game={game}
              card={cardInHand}
              cardPicked="cardInHand"
              thisPlayer={thisPlayer}
              users={users}
              priestPlayed={priestPlayed}
            />
          ) : null}
          {this.state.newCardOptionsDisplayed === true ? (
            <div>
              <img
                className="hand-card-img"
                src={"/img/" + newCard + ".jpg"}
                alt="card"
              />
            </div>
          ) : null}
          {game.whosTurn === thisPlayer.id &&
          this.state.newCardOptionsDisplayed === true ? (
            <CardButtons
              gameID={gameID}
              game={game}
              card={newCard}
              cardPicked="newCard"
              thisPlayer={thisPlayer}
              users={users}
              priestPlayed={priestPlayed}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default YourHand;
