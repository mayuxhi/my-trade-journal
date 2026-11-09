import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmU87ZBmCRguvHAhnDhXK9XCcD6ErM5iY",
  authDomain: "trade-journal-b031e.firebaseapp.com",
  projectId: "trade-journal-b031e",
  storageBucket: "trade-journal-b031e.firebasestorage.app",
  messagingSenderId: "70380889952",
  appId: "1:70380889952:web:1f231bb71d50aea0942005"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
