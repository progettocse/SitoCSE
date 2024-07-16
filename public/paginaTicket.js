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

const selectedDipendenti = [];

let userInfoData = document.getElementById("info");
let userCredsData = document.getElementById("creds");
let logoutBtn = document.getElementById("logout");


let aziOrDip = document.getElementById("aziOrDip");
let titoloPaginaTicket = document.getElementById("titoloPaginaTicket");

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

                    
                    const cantiereSnapshot = await get(child(dbRef, 'Cantieri/' + UserData.cantiere.Nome + "/TICKETS"));

                    

                    if (cantiereSnapshot.exists()) {
                        let azienda;
                        let dipendenti;

                        let tickets = cantiereSnapshot.val();

                        console.log(tickets);

                        const listaTicketsContainer = document.getElementById('ticket');


                        for (let ticketSingolo in tickets) {
                            // controllare le aziende

                            console.log(tickets[ticketSingolo]);


                                    console.log(tickets[ticketSingolo].stato);
                                    console.log(UserInfo.Nome);

                                    let status = tickets[ticketSingolo].stato;

                                    const card = document.createElement('div');
                                    card.className = 'card mb-3';
                                    card.innerHTML = `
                            <div class="card-body d-flex align-items-center justify-content-between">
        <h2 class="card-title">${tickets[ticketSingolo].titolo}</h2>
        <div class="d-flex flex-wrap"> 
            <div class="col-auto statoAperto ms-1">
                <button type="button" class="btn btn-md btn-danger" disabled>APERTO</button>
            </div>
            <div class="col-auto statoPending ms-1">
                <button type="button" class="btn btn-md btn-warning" disabled></button>
            </div>
            
            <div class="col-auto statoChiuso ms-1">
                <button type="button" class="btn btn-md btn-success" disabled>CHIUSO</button>
            </div>
        </div>
        <div class="approval-box text-center">
        <a href="chatTicket.html" class="btn btn-dark mt-2 enter-btn" data-ticket-id="${tickets[ticketSingolo].titolo}">ENTRA</a>
    </div>
    
</div>
                        `;

                                    // Hide the relevant sections if the conditions are not met
                                    let apertoElement = card.querySelector(".statoAperto");
                                    let chiusoElement = card.querySelector(".statoChiuso");
                                    let pendingElement = card.querySelector(".statoPending");

                                    if (apertoElement) {
                                        apertoElement.style.display = (status === "aperto") ? "block" : "none";
                                    }

                                    if (chiusoElement) {
                                        chiusoElement.style.display = (status === "chiuso") ? "block" : "none";
                                    }

                                    if (pendingElement) {
                                        pendingElement.style.display = (status === "pending") ? "block" : "none";
                                    }

                                    listaTicketsContainer.appendChild(card);

                                
                            

                        }

                        // Aggiungi evento click per tutti i pulsanti "Entra"
                        document.querySelectorAll('.enter-btn').forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                event.preventDefault(); // Evita che il link segua il suo href
                                const ticketSelezionatoId = event.target.getAttribute('data-ticket-id');
                                //console.log(aziendaSelezionataId);

                                //const selectedAzienda = aziende[aziendaSelezionataId];
                                //console.log(selectedAzienda);


                                sessionStorage.setItem("user-ticket", JSON.stringify({ ticket: ticketSelezionatoId }));


                                window.location.href = "chatTicket.html";
                            });
                        });


                    }

                    

                } else if (UserInfo.role === "AZI") {
                    titoloPaginaTicket.innerText = "Ticket del cantiere: " + UserData.cantiere.Nome;

                    console.log("AZI");
                    creaDipendentiABtn();

                    
                    if (document.getElementById("placeholder")) {
                        document.getElementById("placeholder").remove();
                    }

                    const cantiereSnapshot = await get(child(dbRef, 'Cantieri/' + UserData.cantiere.Nome + "/TICKETS"));

                    if (cantiereSnapshot.exists()) {
                        let azienda;
                        let dipendenti;

                        let tickets = cantiereSnapshot.val();

                        console.log(tickets);

                        const listaTicketsContainer = document.getElementById('ticket');


                        for (let ticketSingolo in tickets) {
                            // controllare le aziende

                            console.log(tickets[ticketSingolo]);

                            for (let azienda in tickets[ticketSingolo].Aziende) {
                                if (azienda == UserInfo.Nome) {

                                    console.log(tickets[ticketSingolo].stato);
                                    console.log(UserInfo.Nome);

                                    let status = tickets[ticketSingolo].stato;

                                    const card = document.createElement('div');
                                    card.className = 'card mb-3';
                                    card.innerHTML = `
                            <div class="card-body d-flex align-items-center justify-content-between">
        <h2 class="card-title">${tickets[ticketSingolo].titolo}</h2>
        <div class="d-flex flex-wrap"> 
            <div class="col-auto statoAperto ms-1">
                <button type="button" class="btn btn-md btn-danger" disabled>APERTO</button>
            </div>
            <div class="col-auto statoPending ms-1">
                <button type="button" class="btn btn-md btn-warning" disabled></button>
            </div>
            
            <div class="col-auto statoChiuso ms-1">
                <button type="button" class="btn btn-md btn-success" disabled>CHIUSO</button>
            </div>
        </div>
        <div class="approval-box text-center">
        <a href="chatTicket.html" class="btn btn-dark mt-2 enter-btn" data-ticket-id="${tickets[ticketSingolo].titolo}">ENTRA</a>
    </div>
    
</div>
                        `;

                                    // Hide the relevant sections if the conditions are not met
                                    let apertoElement = card.querySelector(".statoAperto");
                                    let chiusoElement = card.querySelector(".statoChiuso");
                                    let pendingElement = card.querySelector(".statoPending");

                                    if (apertoElement) {
                                        apertoElement.style.display = (status === "aperto") ? "block" : "none";
                                    }

                                    if (chiusoElement) {
                                        chiusoElement.style.display = (status === "chiuso") ? "block" : "none";
                                    }

                                    if (pendingElement) {
                                        pendingElement.style.display = (status === "pending") ? "block" : "none";
                                    }

                                    listaTicketsContainer.appendChild(card);

                                }
                            }

                        }

                        // Aggiungi evento click per tutti i pulsanti "Entra"
                        document.querySelectorAll('.enter-btn').forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                event.preventDefault(); // Evita che il link segua il suo href
                                const ticketSelezionatoId = event.target.getAttribute('data-ticket-id');
                                //console.log(aziendaSelezionataId);

                                //const selectedAzienda = aziende[aziendaSelezionataId];
                                //console.log(selectedAzienda);


                                sessionStorage.setItem("user-ticket", JSON.stringify({ ticket: ticketSelezionatoId }));


                                window.location.href = "chatTicket.html";
                            });
                        });


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
