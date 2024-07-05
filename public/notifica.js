import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js";

// Configura Firebase
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

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

document.getElementById('notifica').addEventListener('click', async () => {
    const token = 'df7dqEgRTce6iboNqD_Wgo:APA91bGdJmHYmJ7jb3LkUP1BHTO4yWHstsn_t80xXrkq-bQoSFADGPkPQ6KsNqWLyo0uNjmc64qjM4X8553S7mTf2coF4f8fOEQImBWovCGwRRTIar5j_VwFwLuxXkkFn-64O86YdiSB'; // Sostituisci con il token reale del dispositivo

    const notificationTitle = "CIAO KEVIN";
    const notificationBody = "Ti è arrivata una notifica con l'applicazione CHIUSA";

    try {
        const response = await fetch('https://servercse.onrender.com/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                title: notificationTitle,
                body: notificationBody
            })
        });

        if (response.ok) {
            console.log('Notifica inviata con successo!');
        } else {
            console.error('Errore nell\'invio della notifica');
        }
    } catch (error) {
        console.error('Errore nella richiesta:', error);
    }
});
