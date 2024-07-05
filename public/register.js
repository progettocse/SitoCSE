// Import the functions you need from the SDKs you need

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import { getDatabase, set, ref , get, child} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";


const firebaseConfig = {
  apiKey: "AIzaSyApEGULTM0phGNhvFaH8cgCokHFOhIYMSI",
  authDomain: "sicurezza-5c1a6.firebaseapp.com",
  databaseURL: "https://sicurezza-5c1a6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sicurezza-5c1a6",
  storageBucket: "sicurezza-5c1a6.appspot.com",
  messagingSenderId: "124904876528",
  appId: "1:124904876528:web:4902fbc0fad68bd7565535",
  measurementId: "G-L9RC7PC1L0" // for analystics, not in use for now
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const dbref = ref(db);


//const analytics = getAnalytics(app); // for analystics, not in use for now


document.addEventListener('DOMContentLoaded', () => {
  let MainForm = document.getElementById('MainForm');

  let RegisterUser = evt => {
    evt.preventDefault();
  
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let info = document.getElementById('info');
    let role = document.querySelector('input[name="role"]:checked');
  
    // Verifica se tutti i campi sono stati compilati
    if (email && password && info && role) {
      let roleValue = role.value;
  
      // Verifica se il ruolo è stato selezionato
      if (!roleValue) {
        alert("Seleziona il tuo ruolo.");
        return;
      }
  
      // Esegui la registrazione
      createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
        .then((credentials) => {
          alert("Account creato con successo.");
          console.log(credentials);
  
          // Salva i dati dell'utente nel database
          set(ref(db, 'UsersList/' + credentials.user.uid), {
            nameSurname: info.value.trim(),
            email: email.value.trim(),
            role: roleValue,
          })
          .then(() => {
            console.log("Dati utente salvati con successo nel database.");
  
            // Dopo aver salvato i dati nel database, reindirizza l'utente alla pagina home
            sessionStorage.setItem("user-info", JSON.stringify({
              nameSurname: info.value.trim(),
              role: roleValue,
              email: email.value.trim(),
            }));
            sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
            window.location.href = "home.html";
          })
          .catch((error) => {
            console.error("Errore durante il salvataggio dei dati utente nel database:", error);
          });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
          alert(error.message);
        });
    } else {
      alert("Per favore, compila tutti i campi.");
    }
  }
  

  MainForm.addEventListener('submit', RegisterUser);
});





