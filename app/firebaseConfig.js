// firebaseConfig.js
import { initializeApp } from "firebase/app";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW_AgshPoHx-HGw0HATH3laRArWke6wCs",
  authDomain: "arduino-48e1c.firebaseapp.com",
  databaseURL: "https://arduino-48e1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arduino-48e1c",
  storageBucket: "arduino-48e1c.firebasestorage.app",
  messagingSenderId: "993749537510",
  appId: "1:993749537510:web:3866ce76346cef1280e127"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, auth, database };