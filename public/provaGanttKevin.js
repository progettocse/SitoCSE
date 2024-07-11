import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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
const db = getDatabase(app);


// Funzione per popolare la tabella Gantt
function populateGanttTable(data) {
    const tableBody = document.getElementById("ganttTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    // Crea un oggetto per memorizzare le attività per giorno
    const activitiesByDay = {};

    // Itera sulle attività
    Object.values(data.attività).forEach(activity => {
        for (let date = new Date(activity.data_inizio); date <= new Date(activity.data_fine); date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().slice(0, 10);
            if (!activitiesByDay[formattedDate]) {
                activitiesByDay[formattedDate] = [];
            }
            activitiesByDay[formattedDate].push(activity);
        }
    });

    // Crea le righe della tabella
    for (const date in activitiesByDay) {
        const row = tableBody.insertRow();
        const dateCell = row.insertCell();
        const activitiesCell = row.insertCell();

        dateCell.textContent = date;
        activitiesCell.innerHTML = activitiesByDay[date].map(activity => `<div class="task">${activity.nome}</div>`).join("");
    }
}

// Recupera i dati dal Realtime Database
db.ref().on("value", snapshot => {
    document.getElementById("connectionStatus").textContent = "Connesso al database!";
    populateGanttTable(snapshot.val());
});

// Gestisci errori di connessione
db.ref().on("value", error => {
    document.getElementById("connectionStatus").textContent = "Errore di connessione al database: " + error.message;
});