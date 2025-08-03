// src/firebase/firebaseService.js
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // ✅ Importación corregida

// Guardar reserva
export const guardarReserva = async (datosReserva) => {
  try {
    const docRef = await addDoc(collection(db, "reservas"), datosReserva);
    console.log("Reserva guardada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    throw error;
  }
};

// Obtener todas las reservas
export const obtenerReservas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reservas"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    throw error;
  }
};

// Eliminar reserva por ID
export const eliminarReserva = async (id) => {
  try {
    await deleteDoc(doc(db, "reservas", id));
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    throw error;
  }
};

