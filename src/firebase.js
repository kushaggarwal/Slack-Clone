import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBO8f55G56FpT4S3PLQquCEnXiZP-N_-cE",
  authDomain: "react-slack-clone-79f16.firebaseapp.com",
  databaseURL: "https://react-slack-clone-79f16.firebaseio.com",
  projectId: "react-slack-clone-79f16",
  storageBucket: "react-slack-clone-79f16.appspot.com",
  messagingSenderId: "794731412089",
  appId: "1:794731412089:web:0dd2b7daca81205778b2a8",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
