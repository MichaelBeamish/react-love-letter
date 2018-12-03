import {
  GENERATE_GAME,
  GENERATE_GAME_ERROR,
  CREATED_GAME_TO_NULL,
  GENERATE_NEW_ROUND_GAME,
  GENERATE_NEW_ROUND_GAME_ERROR,
  PLAYER_READY,
  PLAYER_READY_ERROR
} from "../actions/gameActions";

const initState = { gameCreatedID: null };

const gameReducer = (state = initState, action) => {
  switch (action.type) {
    case GENERATE_GAME:
      console.log("generated game", action.payload);
      return { gameCreatedID: action.payload };
    case GENERATE_GAME_ERROR:
      console.log("error generating game", action.payload);
      return state;
    case PLAYER_READY:
      console.log("player ready", action.payload);
      return { gameCreatedID: action.payload };
    case PLAYER_READY_ERROR:
      console.log("player ready error", action.payload);
      return state;
    case GENERATE_NEW_ROUND_GAME:
      console.log("generated new round", action.payload);
      return { gameCreatedID: action.payload };
    case GENERATE_NEW_ROUND_GAME_ERROR:
      console.log("error generating new round", action.payload);
      return state;
    case CREATED_GAME_TO_NULL:
      console.log("reverted game ID to null in redux state");
      return { gameCreatedID: null };
    default:
      return state;
  }
};

export default gameReducer;
