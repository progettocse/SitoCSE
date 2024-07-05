import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";


// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApEGULTM0phGNhvFaH8cgCokHFOhIYMSI",
  authDomain: "sicurezza-5c1a6.firebaseapp.com",
  databaseURL: "https://sicurezza-5c1a6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sicurezza-5c1a6",
  storageBucket: "sicurezza-5c1a6.appspot.com",
  messagingSenderId: "124904876528",
  appId: "1:124904876528:web:4902fbc0fad68bd7565535",
  measurementId: "G-L9RC7PC1L0" // for analytics, not in use for now
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);


const messaging = getMessaging();

// Richiedi il permesso per inviare notifiche
messaging.requestPermission()
  .then(() => {
    console.log('Notification permission granted.');
    return messaging.getToken();
  })
  .then((token) => {
    console.log('FCM Token:', token);
    // Salva il token nel database per inviare notifiche in seguito
  })
  .catch((err) => {
    console.log('Unable to get permission to notify.', err);
  });

// Gestisci i messaggi in arrivo
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // Mostra la notifica sul tuo sito
});
