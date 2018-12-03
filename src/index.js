import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

//npm i redux react-redux
import { createStore, applyMiddleware, compose } from "redux"; //Allows us to use Redux Store and applyMiddleware.
import { Provider } from "react-redux"; //Passes redux store into app.

//npm i redux-thunk
import thunk from "redux-thunk"; //Thunk allows for async requests in Redux. It pauses the dispatch, gets the external data, then resumes the dispatch.

//npm i react-redux-firebase redux-firestore
//This allows firebase to interact with react and redux
import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";

import fbConfig from "./config/fbconfig";

//Root Reducer:
import rootReducer from "./store/reducers/rootReducer";

//Creates the redux store using rootReducer and adds redux thunk as middleware.
//Also added an extra argument to thunk; an object { getFirebase, getFirestore }.
//Compose lets us tell firebase/firestore what db to use via fbconfig.
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(fbConfig),
    reactReduxFirebase(fbConfig, {
      useFirestoreForProfile: true, //sync store profile with users in db
      userProfile: "users",
      attachAuthIsReady: true
    })
  )
);

//Will render after firebaseAuth is ready.
store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
  serviceWorker.unregister();
});
