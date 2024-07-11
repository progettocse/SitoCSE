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
let UserAzienda = JSON.parse(sessionStorage.getItem("user-azienda"));

let userInfoData = document.getElementById("info");
let userCredsData = document.getElementById("creds");
let logoutBtn = document.getElementById("logout");

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ID del CSE specifico
const cseId = UserInfo.ID;

//console.log(UserInfo.Nome);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                if (UserInfo.role === "CSE") {

                    const dbRef = ref(db);
                    const aziendeSnapshot = await get(child(dbRef, 'Aziende'));

                    if (aziendeSnapshot.exists()) {
                        const aziende = aziendeSnapshot.val();

                        const listaDipendentiContainer = document.getElementById('dipendenti');


                        for (let singolaAzienda in aziende) {

                            if (aziende[singolaAzienda].Nome === UserAzienda.azienda) {
                                //console.log(aziende[singolaAzienda].DIPENDENTI); // tutti i dipendenti dell'azienda

                                for (let dipendente in aziende[singolaAzienda].DIPENDENTI) {

                                    //console.log(aziende[singolaAzienda].DIPENDENTI[dipendente]); // ogni singolo dipendente dell'azienda

                                    const card = document.createElement('div');
                                    card.className = 'card mb-3';
                                    card.innerHTML = `
                <div class="card-body d-flex align-items-center">
                  <div class="flex-grow">
                    <h5 class="card-title">${aziende[singolaAzienda].DIPENDENTI[dipendente].Nome} ${aziende[singolaAzienda].DIPENDENTI[dipendente].Cognome}</h5>
                    <p class="card-text"> ${aziende[singolaAzienda].DIPENDENTI[dipendente].CF} </p>

                  </div>

                 

                  <div class="approval-box text-center">
                    
                  <div> <a href="#.html" class="btn btn-dark mt-2 enter-btn" data-dipendente-id="
                    ${aziende[singolaAzienda].DIPENDENTI[dipendente].IDDIP}
                  ">ENTRA</a> </div>

                  </div>
                </div>
              `;

                                    listaDipendentiContainer.appendChild(card);


                                }
                            }
                        }



                        // Aggiungi evento click per tutti i pulsanti "Entra"
                        document.querySelectorAll('.enter-btn').forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                event.preventDefault(); // Evita che il link segua il suo href
                                const dipendenteSelezionatoId = event.target.getAttribute('data-dipendente-id');
                                //const selectedDipendente = aziende[dipendenteSelezionatoId];

                                console.log(dipendenteSelezionatoId);


                                //sessionStorage.setItem("user-dipendente", JSON.stringify({ azienda: selectedAzienda }));

                                window.location.href = "azienda.html";
                            });
                        });

                        document.getElementById("placeholder").remove();

                    } else {
                        console.log("Nessun dato disponibile.");
                    }
                }

                if (UserInfo.role === "AZI") {
                    checkNotificheFromCantiere();
                    creaDipendentiABtn();
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

// crea se CSE accede
function creaDipendentiABtn() {
    const dipendentiABtnContainer = document.getElementById('dipendentiA');
    dipendentiABtnContainer.setAttribute("class", "btn btn-toggle align-items-center rounded");
    dipendentiABtnContainer.innerHTML = `Dipendenti`;
    dipendentiABtnContainer.setAttribute("href", "dipendenti.html");
}

// SE È AZIENDA
// NOTIFICHE DA CANTIERE (NOTIFICHE + MESSAGGI DAL TICKET)
async function checkNotificheFromCantiere() {
    const dbRef = ref(db);
    const cantieriSnapshot = await get(child(dbRef, 'Cantieri'));

    if (cantieriSnapshot.exists()) {
        const cantieri = cantieriSnapshot.val();

        const listaNotificheContainer = document.getElementById('notifiche');


        for (let singoloCantiere in cantieri) {

            for (let azienda in cantieri[singoloCantiere].Aziende) {
                if (azienda == UserInfo.Nome) {
                    console.log(azienda);


                    for (let notifica in cantieri[singoloCantiere].Aziende[azienda].Notifiche) {
                        console.log(cantieri[singoloCantiere].Aziende[azienda].Notifiche[notifica].testo);
                        cantieri[singoloCantiere].Aziende[azienda].Notifiche[notifica].letto = true;
                        //console.log(aziende[singolaAzienda].DIPENDENTI[dipendente]); // ogni singolo dipendente dell'azienda

                        const card = document.createElement('div');
                        card.className = 'card mb-3';
                        card.innerHTML = `
    <div class="card-body d-flex align-items-center">
      <div class="flex-grow-1">
        <h5 class="card-title">Da: ${cantieri[singoloCantiere].Nome}</h5>
        <p class="card-text"> ${cantieri[singoloCantiere].Aziende[azienda].Notifiche[notifica].testo} </p>
      </div>

      <div> <a href="cantiere.html" class="btn btn-dark mt-2 enter-btn" data-cantiere-id="${cantieri[singoloCantiere].Nome}">Controlla</a> </div>

    </div>
  `;

                        // Aggiungi evento click per tutti i pulsanti "Entra"
                        document.querySelectorAll('.enter-btn').forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                event.preventDefault(); // Evita che il link segua il suo href
                                const selectedCantiere = cantieri[singoloCantiere].Nome;
                                sessionStorage.setItem("user-cantiere", JSON.stringify({ cantiere: selectedCantiere }));


                                window.location.href = "cantiere.html";
                            });
                        });

                        listaNotificheContainer.appendChild(card);


                    }


                }

            }


        }

        document.getElementById("placeholder").remove();

    } else {
        console.log("Nessun dato disponibile.");
    }
}
// NOTIFICHE DI SISTEMA

// SE È CSE



window.addEventListener("load", CheckCreds);
logoutBtn.addEventListener("click", SignOut);

