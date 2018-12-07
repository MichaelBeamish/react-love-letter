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
      <div className="center">
        <b>Your Hand:</b>
        <br />
        {game && game.whosTurn === thisPlayer.id ? (
          <small> (click card to show options)</small>
        ) : null}

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
          {game.whosTurn === thisPlayer.id &&
          this.state.cardInHandOptionsDisplayed === true ? (
            <div>
              <p>
                <b>
                  <u>{thisPlayer.cardInHand.toUpperCase()}</u> SELECTED...
                </b>
              </p>
              <CardButtons
                gameID={gameID}
                game={game}
                card={cardInHand}
                cardPicked="cardInHand"
                thisPlayer={thisPlayer}
                users={users}
                priestPlayed={priestPlayed}
              />
            </div>
          ) : null}
          {game.whosTurn === thisPlayer.id &&
          this.state.newCardOptionsDisplayed === true ? (
            <div>
              <p>
                <b>
                  <u>{thisPlayer.newCard.toUpperCase()}</u> SELECTED...
                </b>
              </p>
              <CardButtons
                gameID={gameID}
                game={game}
                card={newCard}
                cardPicked="newCard"
                thisPlayer={thisPlayer}
                users={users}
                priestPlayed={priestPlayed}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default YourHand;
