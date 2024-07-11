// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));
let UserData = JSON.parse(sessionStorage.getItem("user-cantiere"));

// Recupero e stampa dei dati del cronoprogramma
async function recuperaCronoprogramma() {
    const dbref = ref(db);
    const cronoprogrammaSnapshot = await get(child(dbref, 'Cantieri/' + UserData.cantiere.Nome));
    
    if (cronoprogrammaSnapshot.exists()) {
        console.log("ESISTE");

        const elencoAziendeCronoprogramma = cronoprogrammaSnapshot.val();

        for (let azienda in elencoAziendeCronoprogramma) {
            console.log(azienda);
        }
    } else {
        console.log("Il cronoprogramma non esiste");
    }
}

recuperaCronoprogramma();

document.addEventListener('DOMContentLoaded', function () {
    // Inizializzo il calendario
    const calendarEl = document.getElementById('gantt');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        editable: true,
        droppable: true,
        events: function(fetchInfo, successCallback, failureCallback) {
            get(ref(db, 'GanttKevin')).then(snapshot => {
                const data = snapshot.val();
                const activities = data.attività;

                const events = [];
                Object.values(activities).forEach(activity => {
                    events.push({
                        id: activity.id,
                        title: activity.nome,
                        start: activity.data_inizio,
                        end: activity.data_fine
                    });
                });
                successCallback(events);
            }).catch(error => {
                failureCallback(error);
            });
        },
        eventDrop: function(info) {
            updateActivity(info.event.id, info.event.start, info.event.end);
        },
        eventResize: function(info) {
            updateActivity(info.event.id, info.event.start, info.event.end);
        }
    });
    calendar.render();

    // Funzione per aggiornare un'attività nel database
    function updateActivity(activityId, start, end) {
        const startFormatted = start.toISOString().slice(0, 10);
        const endFormatted = end.toISOString().slice(0, 10);
        update(ref(db, `GanttKevin/attività/${activityId}`), {
            data_inizio: startFormatted,
            data_fine: endFormatted
        }).then(() => {
            console.log(`Attività con ID ${activityId} aggiornata correttamente.`);
        }).catch(error => {
            console.error(`Errore durante l'aggiornamento dell'attività: ${error}`);
        });
    }
});
