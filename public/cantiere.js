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

let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));
let UserData = JSON.parse(sessionStorage.getItem("user-cantiere"));

const selectedDipendenti = [];

let userInfoData = document.getElementById("info");
let userCredsData = document.getElementById("creds");
let logoutBtn = document.getElementById("logout");

let titoloCantiere = document.getElementById("nomeCantiere");

let aziOrDip = document.getElementById("aziOrDip");
let ticketAperti = document.getElementById("ticketAperti");


// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const dbRef = ref(db);


// ID del CSE specifico
const cseId = UserInfo.ID;

console.log("Sei nel cantiere:" + UserData.cantiere.Nome);
console.log(UserInfo);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {


        if (user) {
            try {
                if (UserInfo.role === "CSE") {

                    const ticketSnapshot = await get(child(dbRef, 'Cantieri/' + UserData.cantiere.Nome + "/TICKETS"));
                    if (ticketSnapshot.exists()) {
                        const tickets = ticketSnapshot.val();
                        let openTickets = 0;
                        for (let ticket in tickets) {
                            if (tickets[ticket].stato == "aperto") {
                                openTickets++;
                            }
                        }


                        ticketAperti.innerHTML = openTickets;



                    }
                    aziOrDip.innerText = "AZIENDE COINVOLTE";
                    const aziendeSnapshot = await get(child(dbRef, 'Aziende'));
                    if (aziendeSnapshot.exists()) {
                        const aziende = aziendeSnapshot.val();
                        const listaAziendeContainer = document.getElementById('aziende');

                        titoloCantiere.innerText = "Cantiere: " + UserData.cantiere.Nome;

                        for (let aziendeId in UserData.cantiere.Aziende) { // aziende singole del cantiere
                            //console.log(aziendeId); // ID AZIENDE DA CANTIERE
                            for (let infoAziendeId in aziende) {


                                //console.log(aziende[infoAziendeId].IDAZI + " " + aziendeId);
                                if (aziendeId === aziende[infoAziendeId].Nome) {


                                    const card = document.createElement('div');
                                    card.className = 'card mb-3';
                                    card.innerHTML = `
                <div class="card-body d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h5 class="card-title">${aziende[infoAziendeId].Nome}</h5>
                    <p class="card-text"> ${aziende[infoAziendeId].ATECO} </p>
                    <p class="card-text"> ${aziende[infoAziendeId].PEC} </p>

                  </div>

                 

                  <div class="approval-box text-center">
                    
                  <div> <a href="azienda.html" class="btn btn-dark mt-2 enter-btn" data-azienda-id="${aziendeId}">ENTRA</a> </div>

                  </div>
                </div>
              `;

                                    listaAziendeContainer.appendChild(card);
                                }
                            }

                        }

                        // Aggiungi evento click per tutti i pulsanti "Entra"
                        document.querySelectorAll('.enter-btn').forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                event.preventDefault(); // Evita che il link segua il suo href
                                const aziendaSelezionataId = event.target.getAttribute('data-azienda-id');
                                //console.log(aziendaSelezionataId);

                                //const selectedAzienda = aziende[aziendaSelezionataId];
                                //console.log(selectedAzienda);


                                sessionStorage.setItem("user-azienda", JSON.stringify({ azienda: aziendaSelezionataId }));


                                window.location.href = "azienda.html";
                            });
                        });

                        document.getElementById("placeholder").remove();


                    }
                } else if (UserInfo.role === "AZI") {

                    const ticketSnapshot = await get(child(dbRef, 'Cantieri/' + UserData.cantiere.Nome + "/TICKETS"));
                    if (ticketSnapshot.exists()) {
                        const tickets = ticketSnapshot.val();
                        let openTickets = 0;
                        for (let ticket in tickets) {


                            for (let azienda in tickets[ticket].Aziende) {
                                if (azienda == UserInfo.Nome) {
                                    if (tickets[ticket].stato == "aperto") {
                                        openTickets++;
                                    }
                                }
                            }


                            
                        }


                        ticketAperti.innerHTML = openTickets;



                    }

                    titoloCantiere.innerText = "Cantiere: " + UserData.cantiere.Nome;

                    creaDipendentiABtn();
                    popolaElencoDip();
                    creaAddDipBtn();

                    aziOrDip.innerText = "DIPENDENTI COINVOLTI";


                    let azienda;
                    let dipendenti;
                    if (document.getElementById("placeholder")) {
                        document.getElementById("placeholder").remove();
                    }

                    console.log(UserCreds.uid);
                    const aziendeSnapshot = await get(child(dbRef, 'Aziende/'));

                    if (aziendeSnapshot.exists()) {
                        let aziende = aziendeSnapshot.val();

                        azienda = aziende[UserCreds.uid];
                        dipendenti = azienda["DIPENDENTI"];
                        console.log(dipendenti);

                        const listaDipendentiContainer = document.getElementById('dipendenti');


                        for (let dipendente in dipendenti) {
                            console.log(dipendenti[dipendente].Nome);
                            let isAntincendio = dipendenti[dipendente].isAntincendio;
                            let isGestioneEmergenze = dipendenti[dipendente].isEmergency;
                            let isPreposto = dipendenti[dipendente].isPreposto;
                            let isResponsabile = dipendenti[dipendente].isResponsabile;
                            let abc = dipendenti[dipendente].abc.toUpperCase();

                            const card = document.createElement('div');
                            card.className = 'card mb-3';
                            card.innerHTML = `
                            <div class="card-body d-flex align-items-center justify-content-between">
    <div class="d-flex flex-column flex-grow-1">
        <h2 class="card-title">${dipendenti[dipendente].Nome}</h2>
        <div class="d-flex flex-wrap"> 
            <div class="col-auto antincendio ms-1">
                <button type="button" class="btn btn-md btn-danger" disabled>Antincendio</button>
            </div>
            <div class="col-auto gestioneEmergenze ms-1">
                <button type="button" class="btn btn-md btn-warning" disabled>Gestione Emergenze: ${abc}</button>
            </div>
            <div class="col-auto preposto ms-1">
                <button type="button" class="btn btn-md btn-info" disabled>Preposto</button>
            </div>
            <div class="col-auto responsabile ms-1">
                <button type="button" class="btn btn-md btn-success" disabled>Responsabile</button>
            </div>
        </div>
    </div>
    <div class="approval-box text-center">
        <a href="cantiere.html" class="btn btn-dark mt-2 enter-btn" data-dipendente-id="${dipendenti[dipendente].Nome}">APRI</a>
    </div>
</div>
                        `;

                            // Hide the relevant sections if the conditions are not met
                            let antincendioElement = card.querySelector(".antincendio");
                            if (!isAntincendio && antincendioElement) antincendioElement.style.display = "none";

                            let gestioneEmergenzeElement = card.querySelector(".gestioneEmergenze");
                            if (!isGestioneEmergenze && gestioneEmergenzeElement) gestioneEmergenzeElement.style.display = "none";

                            let prepostoElement = card.querySelector(".preposto");
                            if (!isPreposto && prepostoElement) prepostoElement.style.display = "none";

                            let responsabileElement = card.querySelector(".responsabile");
                            if (!isResponsabile && responsabileElement) responsabileElement.style.display = "none";

                            listaDipendentiContainer.appendChild(card);
                        }

                        // Aggiungi evento click per tutti i pulsanti "Entra"
                        document.querySelectorAll('.enter-btn').forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                event.preventDefault(); // Evita che il link segua il suo href
                                const dipendenteSelezionatoId = event.target.getAttribute('data-dipendente-id');
                                //console.log(aziendaSelezionataId);

                                //const selectedAzienda = aziende[aziendaSelezionataId];
                                //console.log(selectedAzienda);


                                sessionStorage.setItem("user-dipendente", JSON.stringify({ dip: dipendenteSelezionatoId }));


                                window.location.href = "infoDipendente.html";
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

async function popolaElencoDip() {
    const dbRef = ref(db);
    const dipSnapshot = await get(child(dbRef, 'Aziende/' + UserCreds.uid + "/DIPENDENTI"));
    console.log(UserCreds);
    const dipendenti = dipSnapshot.val();
    // cerca DIP

    const creaDipContainer = document.getElementById('elencoDip');
    for (let dip in dipendenti) {
        let nome = dipendenti[dip].Nome;
        //console.log(nome);

        const option = document.createElement('option');
        option.setAttribute("value", nome);
        option.innerHTML = nome;

        creaDipContainer.appendChild(option);
    }

}

function creaAddDipBtn() {
    if (!document.getElementById('aggiungi')) {
        const modifyBtnContainer = document.getElementById('addDip');

        const button = document.createElement('button');
        button.className = 'btn btn-primary mb-4';
        button.id = "aggiungi";
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#addModal");
        button.innerHTML = `AGGIUNGI DIPENDENTI AL CANTIERE`;

        modifyBtnContainer.appendChild(button);
    }
}

// Funzione per aggiungere un dipendente alla lista
document.getElementById('addDipBtn').addEventListener('click', function () {
    const select = document.getElementById('elencoDip');
    const selectedValue = select.value;
    const selectedText = select.options[select.selectedIndex].text;


    if (selectedValue) {
        const dipSelezionati = document.getElementById('dip-selezionati');

        // Controlla se l'azienda è già stata aggiunta
        const existingDip = Array.from(dipSelezionati.getElementsByTagName('input')).map(input => input.value);
        if (existingDip.includes(selectedValue)) {
            alert("Dipendente già selezionato!");
            return;
        }

        selectedDipendenti.push(selectedValue);

        // Aggiunge l'azienda selezionata alla lista
        const div = document.createElement('div');
        div.textContent = selectedText;
        dipSelezionati.appendChild(div);

        // Aggiungi l'azienda selezionata come input nascosto per l'invio del form
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'dipendentiSelezionati[]';
        hiddenInput.value = selectedValue;
        dipSelezionati.appendChild(hiddenInput);

        // Resetta il selettore di aziende
        select.value = '';
    }

    console.log(selectedDipendenti);

    // console.log(selectedAziende); // stampa tutte le aziende
});

// creazione RESP
document.addEventListener('DOMContentLoaded', () => {
    let MainForm = document.getElementById('MainForm');

    let AggiungiDipendentiAlCantiere = async evt => {
        evt.preventDefault();

        let dipendentiNelCantiereRef = await ref(db, 'Cantieri/' + UserData.cantiere.Nome + "/Aziende/" + UserInfo.Nome);
        let dipendentiNelCantiereSnapshot = await get(dipendentiNelCantiereRef);

        if (dipendentiNelCantiereSnapshot.exists()) {

            for (let singleDip in selectedDipendenti) {

                let aggiungiDipendenteRef = ref(db, 'Cantieri/' + UserData.cantiere.Nome + "/Aziende/" + UserInfo.Nome + "/DIPENDENTI/" + selectedDipendenti[singleDip]);
                set(aggiungiDipendenteRef, {
                    nome: selectedDipendenti[singleDip],
                }).then(() => {
                    console.log('Dipendente aggiunto con successo ' + selectedDipendenti[singleDip]);
                }).catch((error) => {
                    console.error('Errore durante la aggiunta del dipendente ' + selectedDipendenti[singleDip] + ': ', error);
                });
            }
        }



        // Ricarica la pagina dopo la registrazione del responsabile

        window.location.reload();


    }

    MainForm.addEventListener('submit', AggiungiDipendentiAlCantiere);
});


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ticket').addEventListener('click', (event) => {
        event.preventDefault(); // Evita che il link segua il suo href

        window.location.href = "paginaTicket.html";
    });
});
