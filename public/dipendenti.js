import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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

let selectedDipendente;
let nomeAzienda = UserCreds.uid;  // Assicurati che UserCreds.uid sia definito



//console.log(UserData.azienda);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                creaRespBtn();
                popolaElencoDip();
                if (document.getElementById("placeholder")) {
                    document.getElementById("placeholder").remove();
                }

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

// fa vedere il modale e mostra il bottone "crea un cantiere"
function creaRespBtn() {
    if (!document.getElementById('aggiungi')) {
        const modifyBtnContainer = document.getElementById('respbtn');

        const button = document.createElement('button');
        button.className = 'btn btn-primary mb-4';
        button.id = "aggiungi";
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#addModal");
        button.innerHTML = `AGGIUNGI RESPONSABILE`;

        modifyBtnContainer.appendChild(button);
    }
}



// USARE NELLA PAGINA INFO DIPENDENTE
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

// Funzione per aggiungere un dipendente alla variabile selectedDipendente
document.getElementById('addDipBtn').addEventListener('click', function () {
    const select = document.getElementById('elencoDip');
    const selectedValue = select.value;
    const selectedText = select.options[select.selectedIndex].text;

    if (selectedValue) {
        let dipSelezionato = document.getElementById('dip-selezionato');

        // Rimuove il dipendente già selezionato, se presente
        while (dipSelezionato.firstChild) {
            dipSelezionato.removeChild(dipSelezionato.firstChild);
        }

        selectedDipendente = selectedValue;

        // Aggiunge il nuovo dipendente selezionato alla lista
        const div = document.createElement('div');
        div.textContent = selectedText;
        dipSelezionato.appendChild(div);

        // Aggiunge il nuovo dipendente selezionato come input nascosto per l'invio del form
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'selectedDipendente';
        hiddenInput.value = selectedValue;
        dipSelezionato.appendChild(hiddenInput);

        // Resetta il selettore di dipendenti
        select.value = '';
    }

    console.log(selectedDipendente);
});

// creazione RESP
document.addEventListener('DOMContentLoaded', () => {
    let MainForm = document.getElementById('MainForm');

    let CreaResp = async evt => {
        evt.preventDefault();

        let dipEmail = document.getElementById('email');
        let dipPw = document.getElementById('password');
        let dipCPw = document.getElementById('controlPassword');

        if (!dipEmail || !dipPw || !dipCPw) {
            console.error('Elementi DOM mancanti');
            return;
        }

        let dipendenteRef = await ref(db, 'Aziende/' + UserCreds.uid + "/DIPENDENTI/" + selectedDipendente);
        let dipendenteSnapshot = await get(dipendenteRef);
        if (dipendenteSnapshot.exists()) {
            let dipendenteData = dipendenteSnapshot.val();
            console.log("Modifico i dati del dipendente: " + dipendenteData.Nome);



            // Se tutti gli elementi esistono e non sono vuoti, prosegui con il codice
            if (dipEmail && dipPw && dipCPw) {
                // Esegui la registrazione
                createUserWithEmailAndPassword(auth, dipEmail.value.trim(), dipPw.value.trim())
                    .then((credentials) => {
                        console.log("Dipendente " + selectedDipendente + " reso responsabile.");
                        console.log(credentials);

                        nomeAzienda = UserCreds.uid; 

                        // Salva i dati dell'utente nel database // FAI GET DI TUTTO E SCRIVI EMAIL ETC
                        return  set(ref(db, 'Aziende/' + nomeAzienda + "/DIPENDENTI/" + dipendenteData.Nome), {
                            email: dipEmail.value.trim(),
                            IDAZI: UserCreds.uid,
                            Nome: dipendenteData.Nome,
                            abc: dipendenteData.abc,
                            isAntincendio: dipendenteData.isAntincendio,
                            isEmergency: dipendenteData.isEmergency,
                            isPreposto: dipendenteData.isPreposto,
                            isUnilav: dipendenteData.isUnilav,
                            role: "DIP",
                            scadenzaAntincendio: dipendenteData.scadenzaAntincendio,
                            scadenzaFormazioneS: dipendenteData.scadenzaFormazioneS,
                            scadenzaIS: dipendenteData.scadenzaIS,
                            scadenzaPS: dipendenteData.scadenzaPS,
                            scadenzaPreposto: dipendenteData.scadenzaPreposto,
                            scadenzaUnilav: dipendenteData.scadenzaUnilav,
                            isResponsabile: true,
                        })
                            .then(() => {
                                set(ref(db, 'UsersList/' + credentials.user.uid), {
                                    appnotifyToken: "",
                                    Nome: selectedDipendente,
                                    email: dipEmail.value.trim(),
                                    role: "DIP",
                                    azi: nomeAzienda,
                                })

                                console.log("Dati utente salvati con successo nel database.");
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
                console.error('Tutti i campi sono obbligatori');
            }
        }
        // Ricarica la pagina dopo la registrazione del responsabile
        window.location.reload();
    }

    MainForm.addEventListener('submit', CreaResp);
});


async function popolaElencoDip() {
    const dipSnapshot = await get(child(dbRef, 'Aziende/' + nomeAzienda + "/DIPENDENTI"));
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

// Convalida del form
document.getElementById('MainForm').addEventListener('submit', function (event) {
    const dipSelezionato = document.getElementById('dip-selezionato');

    if (dipSelezionato.children.length === 0) {
        document.getElementById('dipFeedback').style.display = 'block';
        event.preventDefault();
        event.stopPropagation();
    } else {
        document.getElementById('dipFeedback').style.display = 'none';
    }

    this.classList.add('was-validated');

});