// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKdvjLQKQJE5za4Ccy1aJ65E5aX3iyuSA",
  authDomain: "web-profile-42d23.firebaseapp.com",
  projectId: "web-profile-42d23",
  storageBucket: "web-profile-42d23.appspot.com",
  messagingSenderId: "470202496045",
  appId: "1:470202496045:web:9a862d5872f8efaa2bb4a4",
  measurementId: "G-WR54M2HD87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);