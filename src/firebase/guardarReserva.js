// src/firebase/guardarReserva.js
import { collection, addDoc } from "firebase/firestore";
import db from "./firebaseConfig";

// Función para guardar una reserva en la colección "reservas"
export const guardarReserva = async (reserva) => {
  try {
    const docRef = await addDoc(collection(db, "reservas"), reserva);
    console.log("Reserva guardada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    throw error;
  }
};
