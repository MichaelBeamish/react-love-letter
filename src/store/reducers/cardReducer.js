import { PLAY_CARD, PLAY_CARD_ERROR } from "../actions/cardActions";

const initState = {};

const cardReducer = (state = initState, action) => {
  switch (action.type) {
    case PLAY_CARD:
      console.log("card play complete", action.payload);
      return state;
    case PLAY_CARD_ERROR:
      console.log("card play error", action.payload);
      return state;
    default:
      return state;
  }
};

export default cardReducer;
