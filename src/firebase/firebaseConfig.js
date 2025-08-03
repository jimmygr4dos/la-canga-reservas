// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjOf-kkUYFqCZ04jl-FB0crEX_ISGZVQw",
  authDomain: "la-canga-reservas.firebaseapp.com",
  projectId: "la-canga-reservas",
  storageBucket: "la-canga-reservas.appspot.com",
  messagingSenderId: "886018115437",
  appId: "1:886018115437:web:bc1777f23e78d74b1ebc64",
  measurementId: "G-DGKNJ91QX8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ✅ exportación nombrada





