// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDW_AgshPoHx-HGw0HATH3laRArWke6wCs",
  authDomain: "arduino-48e1c.firebaseapp.com",
  databaseURL: "https://arduino-48e1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arduino-48e1c",
  storageBucket: "arduino-48e1c.firebasestorage.app",
  messagingSenderId: "993749537510",
  appId: "1:993749537510:web:3866ce76346cef1280e127"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };