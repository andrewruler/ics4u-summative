import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyCelJdoZvr3DsPXc8CYflG2z1r9tJOwMaU",
    authDomain: "culminating-e3122.firebaseapp.com",
    projectId: "culminating-e3122",
    storageBucket: "culminating-e3122.firebasestorage.app",
    messagingSenderId: "344567857506",
    appId: "1:344567857506:web:150d9c49a00f566dd12c3b"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };