// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🔹 Para login de admin (opcional)

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjOf-kkUYFqCZ04jl-FB0crEX_ISGZVQw",
  authDomain: "la-canga-reservas.firebaseapp.com",
  projectId: "la-canga-reservas",
  storageBucket: "la-canga-reservas.appspot.com",
  messagingSenderId: "886018115437",
  appId: "1:886018115437:web:bc1777f23e78d74b1ebc64",
  measurementId: "G-DGKNJ91QX8"
};

// 🔹 Inicializar la app
const app = initializeApp(firebaseConfig);

// 🔹 Exportaciones nombradas
export const db = getFirestore(app); 
export const auth = getAuth(app); // Para manejo de usuarios si lo necesitas



