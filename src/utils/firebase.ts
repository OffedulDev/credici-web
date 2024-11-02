import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBmJUDvjThCEXG_2Bjv4zeni4__Q4MVMiU",
  authDomain: "credici-giornalino-scolastico.firebaseapp.com",
  projectId: "credici-giornalino-scolastico",
  storageBucket: "credici-giornalino-scolastico.appspot.com",
  messagingSenderId: "36413562956",
  appId: "1:36413562956:web:9c9b7e8b8c0c4bc38a94e9"
};

export default function initFirebase() {
    initializeApp(firebaseConfig);
}