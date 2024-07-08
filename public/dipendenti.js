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

let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let userInfoData = document.getElementById("info");
let userCredsData = document.getElementById("creds");
let logoutBtn = document.getElementById("logout");
let aggiungiDipBtn = document.getElementById("aggiungiDip");

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const dbRef = ref(db);


// ID del CSE specifico
const cseId = UserInfo.ID;

//console.log(UserData.azienda);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                let azienda;
                let dipendenti;

                console.log(UserCreds.uid);
                const aziendeSnapshot = await get(child(dbRef, 'Aziende/'));

                if (aziendeSnapshot.exists()) {
                    let aziende = aziendeSnapshot.val();

                    azienda = aziende[UserCreds.uid];
                    dipendenti = azienda["DIPENDENTI"];
                    console.log(dipendenti);


                    const listaDipendentiContainer = document.getElementById('dipendenti');

                    let scadenzaElement;

                    for (let dipendente in dipendenti) {
                        console.log(dipendenti[dipendente].Nome);


                        const card = document.createElement('div');
                        card.className = 'card mb-3';
                        card.innerHTML = `
                  <div class="card-body align-items-center container-fluid">
                    <div class="row">
                      <h4 class="card-title">${dipendenti[dipendente].Nome}</h4>
                      <div class="row">
                          <p class="card-text">Scadenza IS: </p>
                          <p id="scadenzaIS-${dipendenti[dipendente].Nome.replace(/\s/g, '')}">${dipendenti[dipendente].scadenzaIS}</p>
                    </div>
                    <div class="row">
                          <p class="card-text">Scadenza IS: </p>
                          <p id="scadenzaIS-${dipendenti[dipendente].Nome.replace(/\s/g, '')}">${dipendenti[dipendente].scadenzaIS}</p>
                    </div>
                          
                    </div>

                    
                    
                    
  
                    <div class="approval-box text-center container-fluid">
                       <div> <a href="infoDipendente.html" class="btn btn-dark mt-2 enter-btn" data-dipendente-id="${dipendenti[dipendente].Nome}">ENTRA</a> </div>  
                    </div>
                  </div>
                `;

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

                        listaDipendentiContainer.appendChild(card);


                        const scadenzaISElement = card.querySelector(`#scadenzaIS-${dipendenti[dipendente].Nome.replace(/\s/g, '')}`);
                        if (scadenzaISElement) {
                            let statusClassIS = getScadenzaFromRilascio(dipendenti[dipendente].scadenzaIS, 5);
                            scadenzaISElement.classList.add(statusClassIS);
                        }


                    }

                    document.getElementById("placeholder").remove();

                }


                //for(let dipendente in aziendaSnapshot)



            } catch (error) {
                console.error("Errore durante il recupero dei dati:", error);

            }
        } else {
            // L'utente non è autenticato
            window.location.href = "login.html";
        }
    });
});

function getScadenza(rilascio) {
    const oggi = new Date();
    const dataRilascio = new Date(rilascio.split('/').reverse().join('/')); // Converti "dd/mm/yyyy" a "yyyy/mm/dd" per creare una data valida
    const diffTime = dataRilascio - oggi;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Differenza in giorni

    if (diffDays > 10) {
        return 'status-green';
    } else if (diffDays > 0) {
        return 'status-yellow';
    } else {
        return 'status-red';
    }
}

function getScadenzaFromRilascio(rilascio, anni) {
    const oggi = new Date();
    const dataRilascio = new Date(rilascio.split('/').reverse().join('/')); // Converti "dd/mm/yyyy" a "yyyy/mm/dd" per creare una data valida

    // Aggiungi gli anni alla data di rilascio per ottenere la data di scadenza
    const dataScadenza = new Date(dataRilascio);
    dataScadenza.setFullYear(dataScadenza.getFullYear() + anni);

    // Calcola la differenza in giorni tra oggi e la data di scadenza
    const diffTime = dataScadenza - oggi;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Differenza in giorni

    if (diffDays > 30) {
        return 'status-green';
    } else if (diffDays > 0) {
        return 'status-yellow';
    } else {
        return 'status-red';
    }
}


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

let aggiungiDip = () => {
    window.location.href = "registraDipendente.html";
};

window.addEventListener("load", CheckCreds);
logoutBtn.addEventListener("click", SignOut);
aggiungiDipBtn.addEventListener("click", aggiungiDip);
