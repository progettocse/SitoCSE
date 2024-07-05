// Import the functions you need from the SDKs you need
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApEGULTM0phGNhvFaH8cgCokHFOhIYMSI",
  authDomain: "sicurezza-5c1a6.firebaseapp.com",
  databaseURL: "https://sicurezza-5c1a6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sicurezza-5c1a6",
  storageBucket: "sicurezza-5c1a6.appspot.com",
  messagingSenderId: "124904876528",
  appId: "1:124904876528:web:4902fbc0fad68bd7565535",
  measurementId: "G-L9RC7PC1L0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const dbref = ref(db);

let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');
let mainForm = document.getElementById('MainForm');
let ForgotPassLabel = document.getElementById('forgotpasslabel');

//const userId = credentials.user.uid;
//const userToken = await messaging.getToken();
/*firebase.database().ref('users/' + userId).set({
  fcmToken: userToken
});*/

//console.log(userToken);

let signInUser = evt => {
  evt.preventDefault();

  let email = emailInput.value;
  let password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      //console.log(credentials); // rimuovere?
      //alert("Accesso eseguito con successo"); // rimuovere?

      get(child(dbref, 'UsersList/' + credentials.user.uid)).then((snapshot) =>{
        if(snapshot.exists){
          sessionStorage.setItem("user-info", JSON.stringify({ // salva i valori dell'utente
            Nome: snapshot.val().Nome,
            role: snapshot.val().role,
            email: snapshot.val().email,
            ID: snapshot.val().ID,
          }))
          sessionStorage.setItem("user-creds", JSON.stringify(credentials.user)); // salva le credenziali dell'utente per l'accesso
          window.location.href = "home.html";

        }
      })

    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });
};

let ForgotPassword = () => {
  sendPasswordResetEmail(auth, emailInput.value)
  .then(()=> {
    alert("Una mail per il reset della password è stata inviata al tuo indirizzo email");
  })
  .catch((error) => {
    console.log(error.code);
    console.log(error.message);
  })
}

mainForm.addEventListener('submit', signInUser);
ForgotPassLabel.addEventListener('click', ForgotPassword);
