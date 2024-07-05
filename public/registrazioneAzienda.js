// Import the functions you need from the SDKs you need

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";


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
    let companyName = document.getElementById('companyName');
    let pec = document.getElementById('pec');
    let ateco = document.getElementById('ateco');
    let indirizzo = document.getElementById('address');
    let provincia = document.getElementById('provincia');
    let roleAZI = "AZI";

    // Verifica se tutti i campi sono stati compilati
    if (email && password && companyName) {

      // Esegui la registrazione
      createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
        .then((credentials) => {
          alert("Account creato con successo.");
          console.log(credentials);

          // Salva i dati dell'utente nel database
          set(ref(db, 'Aziende/' + credentials.user.uid), {
            Nome: companyName.value.trim(),
            email: email.value.trim(),
            role: roleAZI,
            IDAZI: credentials.user.uid,
            PEC: pec.value.trim(),
            ATECO: ateco.value.trim(),
            Indirizzo: indirizzo.value.trim(),
            Provincia: provincia.value.trim(),

          })
            .then(() => {
              set(ref(db, 'UsersList/' + credentials.user.uid), {
                Nome: companyName.value.trim(),
                email: email.value.trim(),
                role: roleAZI,    
              })

              console.log("Dati utente salvati con successo nel database.");

              sessionStorage.setItem("user-info", JSON.stringify({
                Nome: companyName.value.trim(),
                EmailAzi: email.value.trim(),
                role: roleAZI,
                IDAZI: credentials.user.uid,
                PEC: pec.value.trim(),
                ATECO: ateco.value.trim(),
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


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()