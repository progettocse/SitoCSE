import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
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
const db = getDatabase(app);
const auth = getAuth(app);
const dbRef = ref(db);

let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));
let UserData = JSON.parse(sessionStorage.getItem("user-cantiere"));
let UserTicket = JSON.parse(sessionStorage.getItem("user-ticket"));


const selectedDipendenti = [];

let userInfoData = document.getElementById("info");
let userCredsData = document.getElementById("creds");
let logoutBtn = document.getElementById("logout");


let aziOrDip = document.getElementById("aziOrDip");
let titoloPaginaTicket = document.getElementById("titoloPaginaChatTicket");

// ID del CSE specifico
const cseId = UserInfo.ID;

console.log("Sei nel cantiere:" + UserData.cantiere.Nome);
console.log(UserInfo);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                
                if (UserInfo.role === "CSE") {
                    titoloPaginaTicket.innerText = "Ticket del cantiere: " + UserData.cantiere.Nome;

                    console.log("CSE");

                    if (document.getElementById("placeholder")) {
                        document.getElementById("placeholder").remove();
                    }
                    const ticketsSnapshot = await get(child(dbRef, 'Cantieri/' + UserData.cantiere.Nome + "/TICKETS/"));

                    if (ticketsSnapshot.exists()) {

                        let tickets = ticketsSnapshot.val();

                        const listaTicketsContainer = document.getElementById('ticket');


                        for (let ticketSingolo in tickets) {

                            //console.log(tickets[ticketSingolo]);

                            // **************** MODIFICARE DA QUA IN POI
                                    for (let messaggio in tickets[ticketSingolo].MESSAGGI) {
                                        //console.log(tickets[ticketSingolo].MESSAGGI[messaggio].testo);

                                        const card = document.createElement('div');

                                        if (tickets[ticketSingolo].MESSAGGI[messaggio].da == UserInfo.Nome) {
                                            card.className = 'chat-message-right pb-4';
                                            card.innerHTML = `
                <div> 
                    <div class="text-muted small text-nowrap mt-2">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].data} - ${tickets[ticketSingolo].MESSAGGI[messaggio].ora}
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                        <div class="font-weight-bold mb-1 nomeUtente">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].da}
                        </div> 
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].testo}
                    </div>
                </div>
            `;
                                        } else {
                                            card.className = 'chat-message-left pb-4';
                                            card.innerHTML = `
                <div> 
                    <div class="text-muted small text-nowrap mt-2">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].data} - ${tickets[ticketSingolo].MESSAGGI[messaggio].ora}
                    </div>
                    <div class="flex-shrink-1 bg-grey rounded py-2 px-3 mr-3">
                        <div class="font-weight-bold mb-1 nomeUtente">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].da}
                        </div> 
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].testo}
                    </div>
                </div>
            `;
                                        }



                                        listaTicketsContainer.appendChild(card);


                                    }
                                
                            

                        }


                    }

                } else if (UserInfo.role === "AZI") {
                    titoloPaginaTicket.innerText = "Ticket: " + UserTicket.ticket;

                    //console.log(UserTicket.ticket);
                    creaDipendentiABtn();


                    if (document.getElementById("placeholder")) {
                        document.getElementById("placeholder").remove();
                    }

                    const ticketsSnapshot = await get(child(dbRef, 'Cantieri/' + UserData.cantiere.Nome + "/TICKETS/"));

                    if (ticketsSnapshot.exists()) {

                        let tickets = ticketsSnapshot.val();

                        const listaTicketsContainer = document.getElementById('ticket');


                        for (let ticketSingolo in tickets) {

                            //console.log(tickets[ticketSingolo]);

                            for (let azienda in tickets[ticketSingolo].Aziende) {
                                if (azienda == UserInfo.Nome) {
                                    for (let messaggio in tickets[ticketSingolo].MESSAGGI) {
                                        //console.log(tickets[ticketSingolo].MESSAGGI[messaggio].testo);

                                        const card = document.createElement('div');

                                        if (tickets[ticketSingolo].MESSAGGI[messaggio].da == UserInfo.Nome) {
                                            card.className = 'chat-message-right pb-4';
                                            card.innerHTML = `
                <div> 
                    <div class="text-muted small text-nowrap mt-2">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].data} - ${tickets[ticketSingolo].MESSAGGI[messaggio].ora}
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                        <div class="font-weight-bold mb-1 nomeUtente">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].da}
                        </div> 
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].testo}
                    </div>
                </div>
            `;
                                        } else {
                                            card.className = 'chat-message-left pb-4';
                                            card.innerHTML = `
                <div> 
                    <div class="text-muted small text-nowrap mt-2">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].data} - ${tickets[ticketSingolo].MESSAGGI[messaggio].ora}
                    </div>
                    <div class="flex-shrink-1 bg-grey rounded py-2 px-3 mr-3">
                        <div class="font-weight-bold mb-1 nomeUtente">
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].da}
                        </div> 
                        ${tickets[ticketSingolo].MESSAGGI[messaggio].testo}
                    </div>
                </div>
            `;
                                        }



                                        listaTicketsContainer.appendChild(card);


                                    }
                                }
                            }

                        }


                    }



                } else {
                    console.log("Nessun dato disponibile.");
                }
            } catch (error) {
                console.error("Errore durante il recupero dei dati:", error);

            }
        } else {
            // L'utente non è autenticato
            window.location.href = "login.html";

        }
    });
});

// INVIO MESSAGGI PREMENDO SUL TASTO INVIA: DA FARE

let SignOut = () => {
    signOut(auth).then(() => {
        sessionStorage.removeItem("user-creds");
        sessionStorage.removeItem("user-info");
        sessionStorage.removeItem("user-cantiere");
        sessionStorage.removeItem("user-azienda");


        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Errore durante il logout:", error);
    });
};

let CheckCreds = () => {
    if (!sessionStorage.getItem("user-creds")) {
        window.location.href = "login.html";
    } else {
        let foundRole;
        switch (UserInfo.role) {
            case "CSE":
                foundRole = ", CSE";
                break;
            case "COM":
                foundRole = "Committente";
                break;
            case "AZI":
                foundRole = "";
                break;
            case "LAV":
                foundRole = "Referente dei lavoratori/Lavoratore";
                break;
            default:
                foundRole = "Ruolo non riconosciuto";
        }

        //userInfoData.innerText = "Utente con email: " + UserCreds.email; // come usare UserCreds
        userCredsData.innerText = UserInfo.Nome + foundRole; // come usare UserInfo
    }
};

function creaDipendentiABtn() {
    const dipendentiABtnContainer = document.getElementById('dipendentiA');
    dipendentiABtnContainer.setAttribute("class", "btn btn-toggle align-items-center rounded");
    dipendentiABtnContainer.innerHTML = `Dipendenti`;
    dipendentiABtnContainer.setAttribute("href", "dipendenti.html");
}

window.addEventListener("load", CheckCreds);
logoutBtn.addEventListener("click", SignOut);
