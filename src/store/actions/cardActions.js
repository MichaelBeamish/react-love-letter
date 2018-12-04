export const PLAY_CARD = "PLAY_CARD";
export const PLAY_CARD_ERROR = "PLAY_CARD_ERROR";

export const playCard = (
  gameID,
  deliveredGame,
  deliveredUsers,
  attackerID,
  victimID,
  card,
  whichCard,
  guess
) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    let game = JSON.parse(JSON.stringify(deliveredGame));
    let users = JSON.parse(JSON.stringify(deliveredUsers));
    let drawPile = game.drawPile;
    let players = game.players;
    let numberOfPlayers = players.length;
    let whosTurn = game.whosTurn;
    let nextPlayer = whosTurn + 1;
    let status = game.status;
    let roundWinner = null;
    let overAllWinner = game.overallWinner;
    let faceDownBurnCards = game.faceDownBurnCards;
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

    //Identify players and create references: (Note: These are not copies.)
    let attacker = players.find(player => player.id === attackerID);
    let attakerInfo = users.find(user => user.id === attacker.userReference);
    let victim = players.find(player => player.id === victimID);
    let victimInfo = users.find(user => user.id === victim.userReference);
    let otherPlayers = [];
    players.forEach(player => {
      if (player.id !== attackerID && player.id !== victimID) {
        otherPlayers.push(player);
      }
    });
    //LOGIC TO SORT CARD BASED ON WHICH CARD WAS CHOSEN FOR PLAY:
    if (whichCard === "cardInHand") {
      attacker.discardedCards.push(attacker.cardInHand);
      attacker.totalDiscardedPoints += cardNumberValues[attacker.cardInHand];
      attacker.cardInHand = attacker.newCard;
      attacker.newCard = null;
    } else {
      attacker.discardedCards.push(attacker.newCard);
      attacker.totalDiscardedPoints += cardNumberValues[attacker.newCard];
      attacker.newCard = null;
    }

    //SPECIFIC CARD/PERSONALIZED MESSAGES TO PLAYERS LOGIC:
    //*****GUARD LOGIC*****
    if (card === "guard") {
      if (attacker.id !== victim.id) {
        if (guess === victim.cardInHand) {
          victim.totalDiscardedPoints += cardNumberValues[victim.cardInHand];
          victim.discardedCards.push(victim.cardInHand);
          victim.cardInHand = null;
          victim.isIn = false;
          victim.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} guessed correctly that you had a ${guess}.`
          );
          otherPlayers.forEach(player =>
            player.personalizedPriorPlays.unshift(
              `${attakerInfo.nickname} guessed correctly that ${
                victimInfo.nickname
              } had a ${guess}.`
            )
          );
          attacker.personalizedPriorPlays.unshift(
            `You guessed correctly that ${victimInfo.nickname} had a ${guess}.`
          );
        } else {
          victim.personalizedPriorPlays.unshift(
            `${
              attakerInfo.nickname
            } guessed incorrectly that you had a ${guess}.`
          );
          otherPlayers.forEach(player =>
            player.personalizedPriorPlays.unshift(
              `${attakerInfo.nickname} guessed incorrectly that ${
                victimInfo.nickname
              } had a ${guess}.`
            )
          );
          attacker.personalizedPriorPlays.unshift(
            `You guessed incorrectly that ${
              victimInfo.nickname
            } had a ${guess}.`
          );
        }
      } else {
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} discarded a guard.`
          )
        );
        attacker.personalizedPriorPlays.unshift(`You discarded a guard.`);
      }
    }

    //*****PRIEST LOGIC*****
    if (card === "priest") {
      if (attacker.id !== victim.id) {
        victim.personalizedPriorPlays.unshift(
          `${attakerInfo.nickname} looked at your hand.`
        );
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} looked at ${victimInfo.nickname}'s hand.`
          )
        );
        attacker.personalizedPriorPlays.unshift(
          `You looked at ${victimInfo.nickname}'s hand.`
        );
      } else {
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} discarded a priest.`
          )
        );
        attacker.personalizedPriorPlays.unshift(`You discarded a priest.`);
      }
    }

    //*****BARON LOGIC*****
    if (card === "baron") {
      if (attacker.id !== victim.id) {
        if (
          cardNumberValues[attacker.cardInHand] >
          cardNumberValues[victim.cardInHand]
        ) {
          victim.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname}'s ${attacker.cardInHand} beat your ${
              victim.cardInHand
            }.`
          );
          otherPlayers.forEach(player =>
            player.personalizedPriorPlays.unshift(
              `${attakerInfo.nickname} played a baron on ${
                victimInfo.nickname
              } and won.`
            )
          );
          attacker.personalizedPriorPlays.unshift(
            `Your ${attacker.cardInHand} beat ${victimInfo.nickname}'s ${
              victim.cardInHand
            }.`
          );
          victim.totalDiscardedPoints += cardNumberValues[victim.cardInHand];
          victim.discardedCards.push(victim.cardInHand);
          victim.cardInHand = null;
          victim.isIn = false;
        } else if (
          cardNumberValues[attacker.cardInHand] <
          cardNumberValues[victim.cardInHand]
        ) {
          otherPlayers.forEach(player =>
            player.personalizedPriorPlays.unshift(
              `${attakerInfo.nickname} played a baron on ${
                victimInfo.nickname
              } and lost.`
            )
          );
          victim.personalizedPriorPlays.unshift(
            `Your ${victim.cardInHand} beat ${attakerInfo.nickname}'s ${
              attacker.cardInHand
            }.`
          );
          attacker.personalizedPriorPlays.unshift(
            `${victimInfo.nickname}'s ${victim.cardInHand} beat your ${
              attacker.cardInHand
            }.`
          );
          attacker.totalDiscardedPoints +=
            cardNumberValues[attacker.cardInHand];
          attacker.discardedCards.push(attacker.cardInHand);
          attacker.cardInHand = null;
          attacker.isIn = false;
        } else {
          otherPlayers.forEach(player =>
            player.personalizedPriorPlays.unshift(
              `${attakerInfo.nickname} played a baron on ${
                victimInfo.nickname
              }. Neither player discarded.`
            )
          );
          victim.personalizedPriorPlays.unshift(
            `${
              attakerInfo.nickname
            } played a baron on you and saw your card. You both have a ${
              victim.cardInHand
            }.`
          );
          attacker.personalizedPriorPlays.unshift(
            `You and ${victimInfo.nickname} both have a ${victim.cardInHand}.`
          );
        }
      } else {
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} discarded a baron.`
          )
        );
        attacker.personalizedPriorPlays.unshift(`You discarded a baron.`);
      }
    }

    //*****HANDMAID LOGIC*****
    if (card === "handmaid") {
      attacker.protected = true;
      attacker.personalizedPriorPlays.unshift(
        `You played a handmaid. Your are protected for one round.`
      );
      otherPlayers.forEach(player =>
        player.personalizedPriorPlays.unshift(
          `${attakerInfo.nickname} played a handmaid.`
        )
      );
    }

    //*****PRINCE LOGIC*****
    if (card === "prince") {
      victim.totalDiscardedPoints += cardNumberValues[victim.cardInHand];
      victim.discardedCards.push(victim.cardInHand);
      if (victim.cardInHand === "princess") {
        victim.cardInHand = null;
        victim.isIn = false;
      } else {
        if (drawPile.length > 0) {
          victim.cardInHand = pickRandom();
        } else {
          victim.cardInHand = JSON.parse(JSON.stringify(faceDownBurnCards[0]));
          faceDownBurnCards = [];
        }
      }
      if (attacker.id !== victim.id) {
        victim.personalizedPriorPlays.unshift(
          `${attakerInfo.nickname} played a prince on you.`
        );
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} played a prince on ${victimInfo.nickname}.`
          )
        );
        attacker.personalizedPriorPlays.unshift(
          `You played a prince on ${victimInfo.nickname}.`
        );
      } else {
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} played a prince on themself.`
          )
        );
        attacker.personalizedPriorPlays.unshift(
          `You played a prince on yourself.`
        );
      }
    }

    //*****KING LOGIC*****
    if (card === "king") {
      if (attacker.id !== victim.id) {
        victim.personalizedPriorPlays.unshift(
          `${attakerInfo.nickname} traded their ${
            attacker.cardInHand
          }  for your ${victim.cardInHand}.`
        );
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} traded cards with ${victimInfo.nickname}.`
          )
        );
        attacker.personalizedPriorPlays.unshift(
          `You traded cards with ${victimInfo.nickname}.`
        );
        let tempPlaceholder = attacker.cardInHand;
        attacker.cardInHand = victim.cardInHand;
        victim.cardInHand = tempPlaceholder;
      } else {
        otherPlayers.forEach(player =>
          player.personalizedPriorPlays.unshift(
            `${attakerInfo.nickname} discarded a king.`
          )
        );
        attacker.personalizedPriorPlays.unshift(`You discarded a king.`);
      }
    }

    //*****COUNTESS LOGIC*****
    if (card === "countess") {
      otherPlayers.forEach(player =>
        player.personalizedPriorPlays.unshift(
          `${attakerInfo.nickname} discarded a countess.`
        )
      );
      attacker.personalizedPriorPlays.unshift(`You discarded a countess.`);
    }

    //IS THE ROUND OVER?:
    let allPlayersStillIn = players.filter(player => player.isIn === true);
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
    players.forEach(player => {
      if (player.id === roundWinner) {
        player.roundPoints++;
        console.log("gave a point to", player.id);
      }
    });
    console.log("all players still in", allPlayersStillIn);
    console.log("round winner", roundWinner);

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
      let nextPlayerReference = players.find(
        player => player.id === nextPlayer
      );
      nextPlayerReference.protected = false;
      nextPlayerReference.newCard = pickRandom();
    }

    //Make async call to database.
    const firestore = getFirestore();
    firestore
      .collection("games")
      .doc(gameID)
      .update({
        status: status,
        roundWinner: roundWinner,
        overAllWinner: overAllWinner,
        whosTurn: nextPlayer,
        drawPile: drawPile,
        players: players,
        faceDownBurnCards: faceDownBurnCards
      })
      .then(() => {
        //Then resumes the dispatch.
        dispatch({ type: PLAY_CARD, payload: card });
      })
      .catch(err => {
        dispatch({ type: PLAY_CARD_ERROR, payload: err });
      });
  };
};
