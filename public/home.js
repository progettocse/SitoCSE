import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
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


let userInfoData = document.getElementById("info");
let userCredsData = document.getElementById("creds");
let logoutBtn = document.getElementById("logout");

let foundRole;

const selectedAziende = [];

let cseId;


document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        if (UserInfo.role === "CSE") {
          document.getElementById("dipendentiA").remove();

          // ID del CSE specifico
          cseId = UserInfo.ID;
          const cantieriSnapshot = await get(child(dbRef, 'Cantieri'));

          //creaModifyBtn();
          creaAggiungiBtn();

          if (cantieriSnapshot.exists()) {

            const cantieri = cantieriSnapshot.val();
            const listaCantieriContainer = document.getElementById('cantieri');
            //document.getElementById("placeholder").remove();

            for (let cantieriId in cantieri) {
              const cantiere = cantieri[cantieriId];
              const aziendeSnapshot = await get(child(dbRef, 'Aziende'));

              let aziendeNameList = [];

              if (aziendeSnapshot.exists()) {
                const aziende = aziendeSnapshot.val();

                for (let aziendaId in cantiere.Aziende) {
                  for (let IDAZI in aziende) {
                    if (aziende[IDAZI].Nome == aziendaId) {

                      aziendeNameList.push(" " + aziende[IDAZI].Nome);
                      //console.log(aziende[IDAZI].Nome);

                    }
                  }

                }
              }

              if (cantiere.CSE === cseId) {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                <div class="card-body d-flex align-items-center">
                  <div class="flex-grow-1">
                    <h4 class="card-title">${cantiere.Nome}</h4>
                    <p class="card-text"> ${aziendeNameList} <br>${cantiere.Indirizzo}</p>
                  </div>

                  <div class="approval-box container-fluid">
                  <h5 class="card-title">APPROVATO: </h5>
                  <div class="approval-status ${cantiere.approved ? 'bg-success' : 'bg-danger'} text-white" id="approval-status">
                      ${cantiere.approved ? 'SI' : 'NO'}
                    </div>
                  </div>

                  <div class="approval-box text-center">
                    
                  <div> <a href="cantiere.html" class="btn btn-dark mt-2 enter-btn" data-cantiere-id="${cantieriId}">ENTRA</a> </div>

                  </div>
                </div>
              `;

                listaCantieriContainer.appendChild(card);


              }
            }

            // Aggiungi evento click per tutti i pulsanti "Entra"
            document.querySelectorAll('.enter-btn').forEach(btn => {
              btn.addEventListener('click', (event) => {
                event.preventDefault(); // Evita che il link segua il suo href
                const cantiereselezionatoId = event.target.getAttribute('data-cantiere-id');
                const selectedCantiere = cantieri[cantiereselezionatoId];
                sessionStorage.setItem("user-cantiere", JSON.stringify({ cantiere: selectedCantiere }));

                window.location.href = "cantiere.html";
              });
            });

            document.getElementById("placeholder").remove();
          }
          popolaElencoAziende();


        } else if (UserInfo.role === "AZI") {
          creaDipendentiABtn();
          //console.log(UserInfo.Nome);
          const cantieriSnapshot = await get(child(dbRef, 'Cantieri'));

          if (cantieriSnapshot.exists()) {

            const cantieri = cantieriSnapshot.val();
            const listaCantieriContainer = document.getElementById('cantieri');
            //document.getElementById("placeholder").remove();

            for (let cantieriId in cantieri) {
              const cantiere = cantieri[cantieriId];
              const aziendeSnapshot = await get(child(dbRef, 'Aziende'));

              let aziendeNameList = [];

              if (aziendeSnapshot.exists()) {
                const aziende = aziendeSnapshot.val();



                for (let aziendaId in cantiere.Aziende) {
                  for (let IDAZI in aziende) {
                    if (aziende[IDAZI].Nome == aziendaId) {

                      aziendeNameList.push(" " + aziende[IDAZI].Nome);

                    }
                  }

                }
              }

              for (let azienda in cantiere.Aziende) {
                //console.log(cantiere.Aziende[azienda].Nome);
                if (cantiere.Aziende[azienda].Nome == UserInfo.Nome) {
                  //console.log("ENTRATO");
                  const card = document.createElement('div');
                  card.className = 'card mb-3';
                  card.innerHTML = `
                  <div class="card-body d-flex align-items-center">
                    <div class="flex-grow-1">
                      <h4 class="card-title">${cantiere.Nome}</h4>
                      <p class="card-text"> ${aziendeNameList} <br>${cantiere.Indirizzo}</p>
                    </div>
  
                    <div class="approval-box container-fluid">
                    <h5 class="card-title">APPROVATO: </h5>
                    <div class="approval-status ${cantiere.approved ? 'bg-success' : 'bg-danger'} text-white" id="approval-status">
                        ${cantiere.approved ? 'SI' : 'NO'}
                      </div>
                    </div>
  
                    <div class="approval-box text-center">
                      
                    <div> <a href="cantiere.html" class="btn btn-dark mt-2 enter-btn" data-cantiere-id="${cantieriId}">ENTRA</a> </div>
  
                    </div>
                  </div>
                `;

                  listaCantieriContainer.appendChild(card);


                }
              }

            }

            // Aggiungi evento click per tutti i pulsanti "Entra"
            document.querySelectorAll('.enter-btn').forEach(btn => {
              btn.addEventListener('click', (event) => {
                event.preventDefault(); // Evita che il link segua il suo href
                const cantiereselezionatoId = event.target.getAttribute('data-cantiere-id');
                const selectedCantiere = cantieri[cantiereselezionatoId];
                sessionStorage.setItem("user-cantiere", JSON.stringify({ cantiere: selectedCantiere }));

                window.location.href = "cantiere.html";
              });
            });

            document.getElementById("placeholder").remove();
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

window.addEventListener("load", CheckCreds);
logoutBtn.addEventListener("click", SignOut);

document.addEventListener('DOMContentLoaded', () => {



  /*
  document.getElementById('creaCantiere').addEventListener('click', function () {


    let cantiereName = document.getElementById('cantiereName');
    let startDate = document.getElementById('startDate');
    let endDate = document.getElementById('endDate');
    let cantiereAddress = document.getElementById('cantiereAddress');
    let provinciaCantiere = document.getElementById('provinciaCantiere');

    //selectedAziende
    set(ref(db, 'Cantieri/' + cantiereName.value.trim()), {
      Nome: cantiereName.value.trim(),
      startDate: startDate.value.trim(),
      endDate: endDate.value.trim(),
      Aziende: selectedAziende,
      Indirizzo: cantiereAddress.value.trim(),
      Provincia: provinciaCantiere.value.trim(),
    });

    console.log(cantiereName.value.trim() + " creato!");

  });
  */
});


function creaModifyBtn() {
  const modifyBtnContainer = document.getElementById('modifybtn');

  const button = document.createElement('button');
  button.className = 'btn btn-primary mb-3';
  button.id = "modifica"
  button.innerHTML = `
               MODIFICA
              `;

  modifyBtnContainer.appendChild(button);
}

// crea opzione Dipendenti per visualizzazione da azienda
function creaDipendentiABtn() {
  const dipendentiABtnContainer = document.getElementById('dipendentiA');
  dipendentiABtnContainer.setAttribute("class", "btn btn-toggle align-items-center rounded");
  dipendentiABtnContainer.innerHTML = `Dipendenti`;
  dipendentiABtnContainer.setAttribute("href", "dipendenti.html");
}

// fa vedere il modale e mostra il bottone "crea un cantiere"
function creaAggiungiBtn() {
  const modifyBtnContainer = document.getElementById('addbtn');

  const button = document.createElement('button');
  button.className = 'btn btn-primary mb-4';
  button.id = "aggiungi";
  button.setAttribute("data-bs-toggle", "modal");
  button.setAttribute("data-bs-target", "#addModal");
  button.innerHTML = `CREA UN CANTIERE`;

  modifyBtnContainer.appendChild(button);
}

// Funzione per aggiungere un'azienda alla lista
document.getElementById('addAziendaBtn').addEventListener('click', function () {
  const select = document.getElementById('elencoAziende');
  const selectedValue = select.value;
  const selectedText = select.options[select.selectedIndex].text;


  if (selectedValue) {
    const aziendeSelezionate = document.getElementById('aziende-selezionate');

    // Controlla se l'azienda è già stata aggiunta
    const existingAziende = Array.from(aziendeSelezionate.getElementsByTagName('input')).map(input => input.value);
    if (existingAziende.includes(selectedValue)) {
      alert("Azienda già selezionata!");
      return;
    }

    selectedAziende.push(selectedValue);

    // Aggiunge l'azienda selezionata alla lista
    const div = document.createElement('div');
    div.textContent = selectedText;
    aziendeSelezionate.appendChild(div);

    // Aggiungi l'azienda selezionata come input nascosto per l'invio del form
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'aziendeSelezionate[]';
    hiddenInput.value = selectedValue;
    aziendeSelezionate.appendChild(hiddenInput);

    // Resetta il selettore di aziende
    select.value = '';
  }

  // console.log(selectedAziende); // stampa tutte le aziende
});


// Convalida del form
document.getElementById('MainForm').addEventListener('submit', function (event) {
  const aziendeSelezionate = document.getElementById('aziende-selezionate');

  if (aziendeSelezionate.children.length === 0) {
    document.getElementById('aziendeFeedback').style.display = 'block';
    event.preventDefault();
    event.stopPropagation();
  } else {
    document.getElementById('aziendeFeedback').style.display = 'none';
  }

  this.classList.add('was-validated');

});


async function popolaElencoAziende() {
  const aziendeSnapshot = await get(child(dbRef, 'Aziende'));
  const aziende = aziendeSnapshot.val();

  const creaCantiereContainer = document.getElementById('elencoAziende');
  for (let azienda in aziende) {
    let nome = aziende[azienda].Nome;
    //console.log(nome);

    const option = document.createElement('option');
    option.setAttribute("value", nome);
    option.innerHTML = nome;

    creaCantiereContainer.appendChild(option);
  }

}

// creazione cantiere
document.addEventListener('DOMContentLoaded', () => {
  let MainForm = document.getElementById('MainForm');

  let CreaCantiere = async evt => {
    evt.preventDefault();

    // Aggiunta nel database 
    let cantiereName = document.getElementById('cantiereName');
    let startDate = document.getElementById('startDate');
    let endDate = document.getElementById('endDate');
    let cantiereAddress = document.getElementById('cantiereAddress');
    let provinciaCantiere = document.getElementById('provinciaCantiere');

    // Se tutti gli elementi esistono, prosegui con il codice
    if (cantiereName != "" && startDate != "" && endDate != "" && cantiereAddress != "" && provinciaCantiere != "") {
      // Log dei valori per debugging
      //console.log(cantiereName.value, startDate.value, endDate.value, cantiereAddress.value, provinciaCantiere.value);

      // Creare il nuovo cantiere nel database
      let newCantiereRef = ref(db, 'Cantieri/' + cantiereName.value);
      set(newCantiereRef, {
        Nome: cantiereName.value,
        startDate: startDate.value,
        endDate: endDate.value,
        Indirizzo: cantiereAddress.value,
        Provincia: provinciaCantiere.value,
        CSE: cseId,
        approved: true,
      }).then(() => {
        console.log('Cantiere creato con successo');

        // Ricarica la pagina dopo la creazione del cantiere
        window.location.reload();

        // *** notificare AZIENDE ***

      }).catch((error) => {
        console.error('Errore nella creazione del cantiere:', error);
      });

      console.log(selectedAziende);

      // Per ogni azienda, la aggiunge al database con il relativo nome
      for (let azienda in selectedAziende) {

        const listaAziendeRef = ref(db, 'Cantieri/' + cantiereName.value + "/Aziende/" + selectedAziende[azienda]);
        set(listaAziendeRef, {
          Nome: selectedAziende[azienda],
        }).then(() => {
          console.log('Azienda aggiunta con successo:' + selectedAziende[azienda]);

          let testoMsg = 'Questa azienda è stata aggiunta al cantiere ' + cantiereName.value + '! Selezionalo nella schermata "Home" e aggiungi i dipendenti che ci lavoreranno.';



          let newNotificaRef = ref(db, 'Cantieri/' + cantiereName.value + "/Aziende/" + selectedAziende[azienda] + "/Notifiche/notifica0");
          set(newNotificaRef, {
            testo: testoMsg,
            letto: false,
          }).then(() => {
            console.log('Notifica creata con successo');
          }).catch((error) => {
            console.error('Errore durante la creazione della notifica:', error);
          });


        }).catch((error) => {
          console.error('Errore durante l\'aggiunta della azienda:', error);
        });

      }

    } else {
      console.error('Tutti i campi sono obbligatori');
    }

  }

  MainForm.addEventListener('submit', CreaCantiere);
});

