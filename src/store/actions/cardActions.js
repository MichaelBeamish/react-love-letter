export const PLAY_CARD = "PLAY_CARD";
export const PLAY_CARD_ERROR = "PLAY_CARD_ERROR";

export const playCard = (
  gameID,
  deliveredGame,
  attackerID,
  victimID,
  card,
  whichCard,
  guess
) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // console.log("CARD ACTION:");
    // console.log("Game ID -", gameID);
    // console.log("Game -", deliveredGame);
    // console.log("Attacker -", attackerID);
    // console.log("Victim -", victimID);
    // console.log("Card -", card);
    // console.log("Which Card -", whichCard);
    // console.log("Guess -", guess);

    let game = JSON.parse(JSON.stringify(deliveredGame));
    let drawPile = game.drawPile;
    let players = game.players;
    let numberOfPlayers = players.length;
    let whosTurn = game.whosTurn;
    let nextPlayer = whosTurn + 1;
    let status = game.status;
    let roundWinner = game.roundWinner;
    let overAllWinner = game.overallWinner;
    let cardNumberValues = {
      guard: 1,
      priest: 2,
      baron: 3,
      handmaid: 4,
      prince: 5,
      king: 6,
      countess: 7,
      princess: 8
    };

    //FUNCTION TO PICK A RANDOM CARD FROM THE DRAW PILE:
    function pickRandom() {
      let rando = drawPile.splice(
        Math.floor(Math.random() * Math.floor(drawPile.length)),
        1
      );
      return rando[0];
    }

    //LOGIC TO SORT CARD BASED ON WHICH CARD WAS CHOSEN FOR PLAY:
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************

    //SPECIFIC CARD/PERSONALIZED MESSAGES TO PLAYERS LOGIC:
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************
    //*************** LOGIC ********************

    //IS THE ROUND OVER?:
    let allPlayersStillIn = players.filter(player => player.isIn === true);
    console.log("players still in", allPlayersStillIn);
    //CONDITIONS FOR DETERMINING IF A ROUND IS OVER:
    //1: IF THERE IS ONLY ONE PLAYER LEFT...
    let numberOfPlayersStillIn = allPlayersStillIn.length;
    if (numberOfPlayersStillIn === 1) {
      status = "roundOver";
      nextPlayer = null;
    }
    if (drawPile.length === 0) {
      //2: IF THERE ARE NO CARDS LEFT IN THE DRAW PILE...
      status = "roundOver";
      nextPlayer = null;
    }

    //WHO WON THE ROUND?:
    if (status === "roundOver") {
      //DO WE HAVE A WINNER?
      if (numberOfPlayersStillIn === 1) {
        //If only 1 player is still in...
        roundWinner = allPlayersStillIn[0].id;
      } else {
        //If more than 1 player is still in...
        //Whoever has the highest card in hand is the winner.
        //Lets get the highest card number...
        let highestCardNumber = 0;
        allPlayersStillIn.forEach(player => {
          if (cardNumberValues[player.cardInHand] > highestCardNumber) {
            highestCardNumber = cardNumberValues[player.cardInHand];
          }
        });
        console.log("highest card number", highestCardNumber);
        //Now that we know the highest value, lets loop through again and see who has it...
        allPlayersStillIn.forEach(player => {
          if (cardNumberValues[player.cardInHand] < highestCardNumber) {
            player.isIn = false;
          }
        });
        //Filter out players who don't have high card.
        allPlayersStillIn = allPlayersStillIn.filter(
          player => player.isIn === true
        );
        numberOfPlayersStillIn = allPlayersStillIn.length;

        //DO WE HAVE A WINNER NOW??
        if (numberOfPlayersStillIn === 1) {
          //If only one left NOW...
          roundWinner = allPlayersStillIn[0].id;
        } else {
          //If STILL more than one left...
          //Whoever has the most discarded points is the winner.
          //Lets get the highest number of discarded cards...
          let mostDiscardedPoints = 0;
          allPlayersStillIn.forEach(player => {
            if (player.totalDiscardedPoints > mostDiscardedPoints) {
              mostDiscardedPoints = player.totalDiscardedPoints;
            }
          });
          //Now that we know the highest amount of discarded cards we will loop and filter again...
          allPlayersStillIn.forEach(player => {
            if (player.totalDiscardedPoints < mostDiscardedPoints) {
              player.isIn = false;
            }
          });
          //Filter out players who don't have highest amount of discarded points.
          allPlayersStillIn = allPlayersStillIn.filter(
            player => player.isIn === true
          );
          numberOfPlayersStillIn = allPlayersStillIn.length;

          //HOW ABOUT NOW? DO WE HAVE A WINNER?
          if (numberOfPlayersStillIn === 1) {
            //If only one left NOW...
            roundWinner = allPlayersStillIn[0].id;
          } else {
            console.log("SUPER TIE!");
            //If discarded points tie? No one gets points? First to do something? Add another round? Last player to go? First player to go?
            //***************************************************ADD SUPER TIE LOGIC HERE*****************************************************
          }
        }
      }
    }

    //If only one round winner award the round winner another point...
    console.log("players", players);
    if (roundWinner) {
      players.forEach(player => {
        if (player.id === roundWinner) {
          player.roundPoints++;
        }
      });
    }

    //IS THE GAME OVER?:
    if (numberOfPlayers === 2) {
      players.forEach(player => {
        if (player.roundPoints === 7) {
          status = "gameOver";
          overAllWinner = player.id;
        }
      });
    }
    if (numberOfPlayers === 3) {
      players.forEach(player => {
        if (player.roundPoints === 5) {
          status = "gameOver";
          overAllWinner = player.id;
        }
      });
    }
    if (numberOfPlayers === 4) {
      players.forEach(player => {
        if (player.roundPoints === 4) {
          status = "gameOver";
          overAllWinner = player.id;
        }
      });
    }

    //IF THE GAME IS STILL GOING... WHO'S TURN IS NEXT?:
    if (status === "inProgress") {
      if (nextPlayer === numberOfPlayers) {
        nextPlayer = 0;
      }
      while (players[nextPlayer].isIn === false) {
        nextPlayer++;
        if (nextPlayer === numberOfPlayers) {
          nextPlayer = 0;
        }
      }

      //UPDATE NEXT PLAYER BEFORE TURN BEGINS
      //Protected to false, etc...
    }

    console.log("status", status);

    // //UPDATING VARIABLES  EXAMPLE:
    // players[0].discardedCards.push(players[0].newCard);
    // players[0].newCard = "";
    // players[1].newCard = pickRandom();
    // whosTurn++;

    //Make async call to database.
    // const firestore = getFirestore();
    // firestore
    //   .collection("games")
    //   .doc(gameID)
    //   .update({
    //     status: status,
    //     roundWinner: roundWinner,
    //     overAllWinner: overAllWinner,
    //     whosTurn: nextPlayer
    //     // drawPile: drawPile,
    //     // players: players
    //   })
    //   .then(() => {
    //     //Then resumes the dispatch.
    //     dispatch({ type: PLAY_CARD, payload: card });
    //   })
    //   .catch(err => {
    //     dispatch({ type: PLAY_CARD_ERROR, payload: err });
    //   });
  };
};
