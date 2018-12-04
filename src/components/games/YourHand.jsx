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
        <h5>Your Hand:</h5>

        {cardInHand ? (
          <div className="row center">
            <img
              onClick={() => this.cardInHandClicked()}
              className="hand-card-img"
              src={"/img/" + cardInHand + ".jpg"}
              alt="card"
            />
            <br />
            {game.whosTurn === thisPlayer.id &&
            this.state.cardInHandOptionsDisplayed === false ? (
              <small>(click for play options)</small>
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
          </div>
        ) : null}
        {newCard ? (
          <div className="row center">
            <img
              onClick={() => this.newCardClicked()}
              className="hand-card-img"
              src={"/img/" + newCard + ".jpg"}
              alt="card"
            />
            <br />
            {game.whosTurn === thisPlayer.id &&
            this.state.newCardOptionsDisplayed === false ? (
              <small>(click for play options)</small>
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
        ) : null}
      </div>
    );
  }
}

export default YourHand;
