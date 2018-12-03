import { combineReducers } from "redux"; //Combines reducers.
import { firestoreReducer } from "redux-firestore"; //Pre-made reducer to sync firestore data with state in the background.
import { firebaseReducer } from "react-redux-firebase"; //Pre-made reducer to sync firebase auth with redux.

import authReducer from "./authReducer";
import gameReducer from "./gameReducer";
import cardReducer from "./cardReducer";

const rootReducer = combineReducers({
  card: cardReducer,
  auth: authReducer,
  gameReducer: gameReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
