export const GENERATE_GAME = "GENERATE_GAME";
export const GENERATE_GAME_ERROR = "GENERATE_GAME_ERROR";
export const GENERATE_NEW_ROUND_GAME = "GENERATE_NEW_ROUND_GAME";
export const GENERATE_NEW_ROUND_GAME_ERROR = "GENERATE_NEW_ROUND_GAME_ERROR";
export const CREATED_GAME_TO_NULL = "CREATED_GAME_TO_NULL";
export const PLAYER_READY = "PLAYER_READY";
export const PLAYER_READY_ERROR = "PLAYER_READY_ERROR";

export const createdToNull = () => {
  return {
    type: CREATED_GAME_TO_NULL
  };
};

export const generateGame = (receivedPlayers, gameName) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //Uses thunk. A function that takes in the dispatch.
    //Pauses the dispatch.

    //INITIALIZE GAME:
    let player1;
    let player2;
    let player3;
    let player4;
    let players = [];
    let faceUpBurnCards = [];
    let faceDownBurnCards = [];
    let drawPile = [
      "guard",
      "guard",
      "guard",
      "guard",
      "guard",
      "priest",
      "priest",
      "baron",
      "baron",
      "handmaid",
      "handmaid",
      "prince",
      "prince",
      "king",
      "countess",
      "princess"
    ];

    function pickRandom() {
      let rando = drawPile.splice(
        Math.floor(Math.random() * Math.floor(drawPile.length)),
        1
      );
      return rando[0];
    }

    if (receivedPlayers.length >= 2) {
      //PLAYER 1:
      player1 = {
        id: 0,
        userReference: receivedPlayers[0],
        cardInHand: "",
        newCard: "",
        chosenCard: "",
        discardedCards: [],
        totalDiscardedPoints: 0,
        protected: false,
        isIn: true,
        roundPoints: 0,
        isReadyForNextRound: false,
        personalizedPriorPlays: []
      };
      players.push(player1);
      players[0].cardInHand = pickRandom();
      players[0].newCard = pickRandom();
      //PLAYER 2:
      player2 = {
        id: 1,
        userReference: receivedPlayers[1],
        cardInHand: "",
        newCard: "",
        chosenCard: "",
        discardedCards: [],
        totalDiscardedPoints: 0,
        protected: false,
        isIn: true,
        roundPoints: 0,
        isReadyForNextRound: false,
        personalizedPriorPlays: []
      };
      players.push(player2);
      players[1].cardInHand = pickRandom();
      faceDownBurnCards.push(pickRandom());
    }
    if (receivedPlayers.length >= 3) {
      //PLAYER 3:
      player3 = {
        id: 2,
        userReference: receivedPlayers[2],
        cardInHand: "",
        newCard: "",
        chosenCard: "",
        discardedCards: [],
        totalDiscardedPoints: 0,
        protected: false,
        isIn: true,
        roundPoints: 0,
        isReadyForNextRound: false,
        personalizedPriorPlays: []
      };
      players.push(player3);
      players[2].cardInHand = pickRandom();
    }
    if (receivedPlayers.length >= 4) {
      //PLAYER 4:
      player4 = {
        id: 3,
        userReference: receivedPlayers[3],
        cardInHand: "",
        newCard: "",
        chosenCard: "",
        discardedCards: [],
        totalDiscardedPoints: 0,
        protected: false,
        isIn: true,
        roundPoints: 0,
        isReadyForNextRound: false,
        personalizedPriorPlays: []
      };
      players.push(player4);
      players[3].cardInHand = pickRandom();
    }

    //Burn three face up if there are 2 players:
    if (receivedPlayers.length === 2) {
      faceUpBurnCards.push(pickRandom());
      faceUpBurnCards.push(pickRandom());
      faceUpBurnCards.push(pickRandom());
    }

    //Make async call to database.
    const firestore = getFirestore();
    firestore
      .collection("games")
      .add({
        gameName: gameName,
        players: players,
        faceUpBurnCards: faceUpBurnCards,
        faceDownBurnCards: faceDownBurnCards,
        drawPile: drawPile,
        status: "inProgress",
        round: 1,
        roundWinner: null,
        overallWinner: null,
        whosTurn: 0,
        createdAt: new Date()
      })
      .then(game => {
        //Then resumes the dispatch.
        dispatch({ type: GENERATE_GAME, payload: game.id });
      })
      .catch(err => {
        dispatch({ type: GENERATE_GAME_ERROR, payload: err });
      });
  };
};

export const generateNewRound = (gameID, deliveredGame) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {};
};

export const playerReadyForNextRound = (gameID, deliveredGame, playerID) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    let game = JSON.parse(JSON.stringify(deliveredGame));
    let players = game.players;

    players.forEach(player => {
      if (player.id === playerID) {
        player.isReadyForNextRound = true;
      }
    });

    //Are all players ready?
    let answer = true;
    players.forEach(player => {
      if (player.isReadyForNextRound === false) {
        answer = false;
      }
    });
    if (answer === false) {
      //Make async call to database.
      const firestore = getFirestore();
      firestore
        .collection("games")
        .doc(gameID)
        .update({
          players: players
        })
        .then(() => {
          //Then resumes the dispatch.
          dispatch({ type: PLAYER_READY, payload: gameID });
        })
        .catch(err => {
          dispatch({ type: PLAYER_READY_ERROR, payload: err });
        });
    } else {
      let whosTurn = game.roundWinner;
      let faceUpBurnCards = [];
      let faceDownBurnCards = [];
      let drawPile = [
        "guard",
        "guard",
        "guard",
        "guard",
        "guard",
        "priest",
        "priest",
        "baron",
        "baron",
        "handmaid",
        "handmaid",
        "prince",
        "prince",
        "king",
        "countess",
        "princess"
      ];

      //FUNCTION TO PICK A RANDOM CARD FROM THE DRAW PILE:
      function pickRandom() {
        let rando = drawPile.splice(
          Math.floor(Math.random() * Math.floor(drawPile.length)),
          1
        );
        return rando[0];
      }

      //Burn one face down card always...
      faceDownBurnCards.push(pickRandom());
      //Burn three face up if there are 2 players...
      if (players.length === 2) {
        faceUpBurnCards.push(pickRandom());
        faceUpBurnCards.push(pickRandom());
        faceUpBurnCards.push(pickRandom());
      }

      players.forEach(player => {
        player.cardInHand = pickRandom();
        player.newCard = "";
        if (player.id === whosTurn) {
          player.newCard = pickRandom();
        }
        player.chosenCard = "";
        player.discardedCards = [];
        player.totalDiscardedPoints = 0;
        player.protected = false;
        player.isIn = true;
        player.isReadyForNextRound = false;
        player.personalizedPriorPlays = [];
      });

      console.log("Made it to round over action!");

      //Make async call to database.
      const firestore = getFirestore();
      firestore
        .collection("games")
        .doc(gameID)
        .update({
          players: players,
          faceUpBurnCards: faceUpBurnCards,
          faceDownBurnCards: faceDownBurnCards,
          drawPile: drawPile,
          status: "inProgress",
          round: game.round + 1,
          roundWinner: null,
          whosTurn: whosTurn
        })
        .then(() => {
          //Then resumes the dispatch.
          dispatch({ type: GENERATE_NEW_ROUND_GAME, payload: gameID });
        })
        .catch(err => {
          dispatch({ type: GENERATE_NEW_ROUND_GAME_ERROR, payload: err });
        });
    }

    console.log("Made it to player ready action!");
  };
};
