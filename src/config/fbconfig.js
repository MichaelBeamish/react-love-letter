import firebase from "firebase/app"; //Importing just the base features from firebase.
import "firebase/firestore"; //Importing the database from firebase.
import "firebase/auth"; //Importing auth abilities from firebase.

// Initialize Firebase
//npm i firebase
var config = {
  apiKey: "AIzaSyD_Md2UpxvBTy8ch6I5PADuevx9KdcZDew",
  authDomain: "love-letter-app.firebaseapp.com",
  databaseURL: "https://love-letter-app.firebaseio.com",
  projectId: "love-letter-app",
  storageBucket: "love-letter-app.appspot.com",
  messagingSenderId: "795650758100"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true }); //Update to handle timestamps.

export default firebase; //Make it available elsewhere in the app.
