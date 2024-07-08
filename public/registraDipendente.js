import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import { getDatabase, set, ref as refDB, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";


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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const dbref = refDB(db);
const storage = getStorage(app);


// Bottone Annulla
/*document.addEventListener("DOMContentLoaded", () => {
  let undoBtn = document.getElementById("undo");
  let undoDip = () => {
    console.log("torno nella pagina dipendenti");
    window.location.href = "dipendenti.html";
  };
  undoBtn.addEventListener("click", undoDip);
});*/

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('undo').addEventListener('click', () => {
    window.location.href = 'dipendenti.html';
  });
});

//const analytics = getAnalytics(app); // for analystics, not in use for now

// È Responsabile -- FUTURO
/*
document.addEventListener('DOMContentLoaded', function () {
  const siRSPRadio = document.getElementById('siRSP');
  const noRPSRadio = document.getElementById('noRSP');
  const emailContainer = document.getElementById('emailRSPContainer');
  const passwordContainer = document.getElementById('passwordRSPContainer');
  const confermaContainer = document.getElementById('confermaRSPContainer');


  function toggleFields() {
    if (siRSPRadio.checked) {
      emailContainer.classList.remove('hidden');
      passwordContainer.classList.remove('hidden');
      confermaContainer.classList.remove('hidden');


    } else {
      emailContainer.classList.add('hidden');
      passwordContainer.classList.add('hidden');
      confermaContainer.classList.add('hidden');
    }
  }

  siRSPRadio.addEventListener('change', toggleFields);
  noRPSRadio.addEventListener('change', toggleFields);

  // Initialize visibility on page load
  toggleFields();
});*/

// Unilav ha scadenza
let scadenzaUnilav = "";
document.addEventListener('DOMContentLoaded', function () {
  const siRadio = document.getElementById('siUnilav');
  const noRadio = document.getElementById('noUnilav');
  const scadenzaContainer = document.getElementById('scadenzaUnilav');


  function toggleFields() {
    if (!siRadio.checked) {
      scadenzaContainer.classList.remove('hidden');



    } else {
      scadenzaContainer.classList.add('hidden');

    }
  }

  siRadio.addEventListener('change', toggleFields);
  noRadio.addEventListener('change', toggleFields);

  // Initialize visibility on page load
  toggleFields();
});
// Scadenza Unilav // controlla nel futuro
document.addEventListener('DOMContentLoaded', function () {
  const inputScadenza = document.getElementById('inputUNScadenza');
  const scadenzaWarning = document.getElementById('scadenzaUNWarning');

  inputScadenza.addEventListener('input', function () {
    const value = inputScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();

      if (inputDate < currentDate) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
        scadenzaUnilav = inputScadenza.value;
      }
    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });


});

// Gestione Emergenze
document.addEventListener('DOMContentLoaded', function () {
  const siRadio = document.getElementById('siGE');
  const noRadio = document.getElementById('noGE');
  const rilascioContainer = document.getElementById('rilascioPS');
  const attestatoContainer = document.getElementById('attestatoPS');
  const tipoAttestatoContainer = document.getElementById('tipoAttestato');

  function toggleFields() {
    if (siRadio.checked) {
      rilascioContainer.classList.remove('hidden');
      attestatoContainer.classList.remove('hidden');
      tipoAttestatoContainer.classList.remove('hidden');

    } else {
      rilascioContainer.classList.add('hidden');
      attestatoContainer.classList.add('hidden');
      tipoAttestatoContainer.classList.add('hidden');

    }
  }

  siRadio.addEventListener('change', toggleFields);
  noRadio.addEventListener('change', toggleFields);

  // Initialize visibility on page load
  toggleFields();
});

// Attestato Antincendio
let scadenzaAntincendio = "";
document.addEventListener('DOMContentLoaded', function () {
  const siAIRadio = document.getElementById('siAI');
  const noAIRadio = document.getElementById('noAI');
  const attestatoAIContainer = document.getElementById('attAIContainer');
  const rilascioAIContainer = document.getElementById('rilAIContainer');


  function toggleFields() {
    if (siAIRadio.checked) {
      attestatoAIContainer.classList.remove('hidden');
      rilascioAIContainer.classList.remove('hidden');

    } else {
      attestatoAIContainer.classList.add('hidden');
      rilascioAIContainer.classList.add('hidden');
    }
  }

  siAIRadio.addEventListener('change', toggleFields);
  noAIRadio.addEventListener('change', toggleFields);

  // Initialize visibility on page load
  toggleFields();
});
// Rilascio/Scadenza Antincendio // controlla nel passato
document.addEventListener('DOMContentLoaded', function () {
  const inputAIScadenza = document.getElementById('inputAIScadenza');
  const scadenzaWarning = document.getElementById('scadenzaAIWarning');

  inputAIScadenza.addEventListener('input', function () {
    const value = inputAIScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

      if (inputDate < fiveYearsAgo) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
        scadenzaAntincendio = inputAIScadenza.value;
      }
    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });
});

let scadenzaIS = "";
//Scadenza Idoneità Sanitaria // controlla nel passato
document.addEventListener('DOMContentLoaded', function () {
  const inputScadenza = document.getElementById('inputISScadenza');
  const scadenzaWarning = document.getElementById('scadenzaISWarning');
  const anniScadenza = 1; // cambiare anni scadenza

  inputScadenza.addEventListener('input', function () {
    const value = inputScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - anniScadenza);

      if (inputDate < fiveYearsAgo) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
        scadenzaIS = inputScadenza.value;
      }

    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });

});

let scadenzaPS = "";
//Scadenza Primo Soccorso // controlla nel passato
document.addEventListener('DOMContentLoaded', function () {
  const inputScadenza = document.getElementById('inputPSScadenza');
  const scadenzaWarning = document.getElementById('scadenzaPSWarning');
  const anniScadenza = 3; // cambiare anni scadenza

  inputScadenza.addEventListener('input', function () {
    const value = inputScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - anniScadenza);

      if (inputDate < fiveYearsAgo) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
        scadenzaPS = inputScadenza.value;

      }
    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });

});


//Scadenza Antincendio // controlla nel passato
document.addEventListener('DOMContentLoaded', function () {
  const inputScadenza = document.getElementById('inputAIScadenza');
  const scadenzaWarning = document.getElementById('scadenzaAIWarning');
  const anniScadenza = 5; // cambiare anni scadenza

  inputScadenza.addEventListener('input', function () {
    const value = inputScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - anniScadenza);

      if (inputDate < fiveYearsAgo) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
      }
    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });
});

// Preposto
let scadenzaPreposto = "";
document.addEventListener('DOMContentLoaded', function () {
  const siRadio = document.getElementById('siPRE');
  const noRadio = document.getElementById('noPRE');
  const rilascioContainer = document.getElementById('rilascioPRE');
  const attestatoContainer = document.getElementById('attestatoPRE');

  function toggleFields() {
    if (siRadio.checked) {
      rilascioContainer.classList.remove('hidden');
      attestatoContainer.classList.remove('hidden');

    } else {
      rilascioContainer.classList.add('hidden');
      attestatoContainer.classList.add('hidden');

    }
  }

  siRadio.addEventListener('change', toggleFields);
  noRadio.addEventListener('change', toggleFields);

  // Initialize visibility on page load
  toggleFields();
});
//Scadenza Preposto // controlla nel passato
document.addEventListener('DOMContentLoaded', function () {
  const inputScadenza = document.getElementById('inputPRScadenza');
  const scadenzaWarning = document.getElementById('scadenzaPRWarning');
  const anniScadenza = 5; // cambiare anni scadenza

  inputScadenza.addEventListener('input', function () {
    const value = inputScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - anniScadenza);

      if (inputDate < fiveYearsAgo) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
        scadenzaPreposto = inputScadenza.value;
      }
    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });
});

//Scadenza Formazione Specifica // controlla nel passato
let scadenzaFormazioneS = "";
document.addEventListener('DOMContentLoaded', function () {
  const inputScadenza = document.getElementById('inputFSScadenza');
  const scadenzaWarning = document.getElementById('scadenzaFSWarning');
  const anniScadenza = 5; // cambiare anni scadenza

  inputScadenza.addEventListener('input', function () {
    const value = inputScadenza.value;
    if (value) {
      const [day, month, year] = value.split('/').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(currentDate.getFullYear() - anniScadenza);

      if (inputDate < fiveYearsAgo) {
        scadenzaWarning.classList.remove('hidden');
      } else {
        scadenzaWarning.classList.add('hidden');
        scadenzaFormazioneS = inputScadenza.value;
      }
    } else {
      scadenzaWarning.classList.add('hidden');
    }
  });
});

// isUnilav Radio Button
let isUnilav = true;
// se cambia, isUnilav Cambia
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona il gruppo di radio button
  const radioButtons = document.querySelectorAll('input[name="radioUnilav"]');

  // Funzione per ottenere il valore selezionato
  const getSelectedValue = () => {
    const selectedRadio = document.querySelector('input[name="radioUnilav"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  };

  // Variabile per memorizzare il valore selezionato
  let selectedValue = getSelectedValue();
  //console.log('Initial Selected Value:', selectedValue);

  // Event listener per cambiare il valore selezionato quando cambia
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = getSelectedValue();
      //console.log('Selected Value:', selectedValue);
      if (selectedValue === "si") {
        isUnilav = true;
      } else {
        isUnilav = false;
      }
      //console.log('isResponsabile:', isUnilav);
    });
  });

});

// isResponsabile Radio Button
let isResponsabile = false;
// se cambia, isResponsabile Cambia
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona il gruppo di radio button
  const radioButtons = document.querySelectorAll('input[name="radioRSP"]');

  // Funzione per ottenere il valore selezionato
  const getSelectedValue = () => {
    const selectedRadio = document.querySelector('input[name="radioRSP"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  };

  // Variabile per memorizzare il valore selezionato
  let selectedValue = getSelectedValue();

  // Event listener per cambiare il valore selezionato quando cambia
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = getSelectedValue();
      //console.log('Selected Value:', selectedValue);
      if (selectedValue === "si") {
        isResponsabile = true;
      } else {
        isResponsabile = false;
      }
    });
  });

});

// isEmergency Radio Button
let isEmergency = false;
// se cambia, isEmergency Cambia
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona il gruppo di radio button
  const radioButtons = document.querySelectorAll('input[name="gestioneEmergenze"]');

  // Funzione per ottenere il valore selezionato
  const getSelectedValue = () => {
    const selectedRadio = document.querySelector('input[name="gestioneEmergenze"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  };

  // Variabile per memorizzare il valore selezionato
  let selectedValue = getSelectedValue();

  // Event listener per cambiare il valore selezionato quando cambia
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = getSelectedValue();
      //console.log('Selected Value:', selectedValue);
      if (selectedValue === "si") {
        isEmergency = true;
      } else {
        isEmergency = false;
      }

    });
  });

});

// isEmergencyABC Radio Button // prendere solo se isEmergency == true
let abc = ""; //default
// se cambia, isAntincendio Cambia
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona il gruppo di radio button
  const radioButtons = document.querySelectorAll('input[name="abc"]');

  // Funzione per ottenere il valore selezionato
  const getSelectedValue = () => {
    const selectedRadio = document.querySelector('input[name="abc"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  };

  // Variabile per memorizzare il valore selezionato
  let selectedValue = getSelectedValue();

  // Event listener per cambiare il valore selezionato quando cambia
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = getSelectedValue();
      //console.log('Selected Value:', selectedValue);
      if (selectedValue === "si") {
        abc = "a";
      } else {
        abc = "bc";
      }


    });
  });

});

// isAntincendio Radio Button
let isAntincendio = false;
// se cambia, isAntincendio Cambia
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona il gruppo di radio button
  const radioButtons = document.querySelectorAll('input[name="isAI"]');

  // Funzione per ottenere il valore selezionato
  const getSelectedValue = () => {
    const selectedRadio = document.querySelector('input[name="isAI"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  };

  // Variabile per memorizzare il valore selezionato
  let selectedValue = getSelectedValue();

  // Event listener per cambiare il valore selezionato quando cambia
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = getSelectedValue();
      //console.log('Selected Value:', selectedValue);
      if (selectedValue === "si") {
        isAntincendio = true;
      } else {
        isAntincendio = false;
      }

    });
  });

});

// isAntincendio Radio Button
let isPreposto = false;
// se cambia, isAntincendio Cambia
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona il gruppo di radio button
  const radioButtons = document.querySelectorAll('input[name="isPreposto"]');

  // Funzione per ottenere il valore selezionato
  const getSelectedValue = () => {
    const selectedRadio = document.querySelector('input[name="isPreposto"]:checked');
    return selectedRadio ? selectedRadio.value : null;
  };

  // Variabile per memorizzare il valore selezionato
  let selectedValue = getSelectedValue();

  // Event listener per cambiare il valore selezionato quando cambia
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedValue = getSelectedValue();
      //console.log('Selected Value:', selectedValue);
      if (selectedValue === "si") {
        isPreposto = true;
      } else {
        isPreposto = false;
      }

    });
  });

});

// SUBMIT FORM
const form = document.getElementById('MainForm');

const UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
const UserInfo = JSON.parse(sessionStorage.getItem("user-info"));
console.log(UserInfo.Nome);

//dipName
let dipName = "";
document.addEventListener('DOMContentLoaded', function () {
  const inputName = document.getElementById('dipName');

  inputName.addEventListener('input', function () {
    const value = inputName.value;
    if (value) {
      dipName = value;
    }
  });
});

document.getElementById('uploadCIButton').addEventListener('click', (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('inputCI');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Carta di Identità caricata!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadPMSButton').addEventListener('click', (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('inputPMS');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Permesso di Soggiorno caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadIAButton').addEventListener('click', (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('inputIA');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Tesserino Identificativo caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadUNButton').addEventListener('click', (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('inputUN');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('UniLav caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadISButton').addEventListener('click', (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('inputIS');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Idoneità Sanitaria caricata!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadPSButton').addEventListener('click', (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('inputPS');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Attestato di Primo Soccorso caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadAIButton').addEventListener('click', (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('inputAI');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Attestato Antincendio caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadPRButton').addEventListener('click', (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('inputPR');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Attestato di formazione per Preposto caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadFGButton').addEventListener('click', (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('inputFG');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Attestato di Formazione Generale caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

document.getElementById('uploadSPButton').addEventListener('click', (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('inputSP');
  const file = fileInput.files[0];
  if (file) {
    //const storageRef = ref(storage, 'documenti/' + file.name);
    const fileRef = ref(storage, 'documenti/aziende/' + UserInfo.Nome + '/dipendenti/' + dipName + '/' + file.name);

    uploadBytes(fileRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      alert('Attestato di Formazione Specifica caricato!');
      //loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});


form.addEventListener('submit', function (event) {
  event.preventDefault(); // Previeni il comportamento di default del form

  // Verifica se il form è valido
  if (!form.checkValidity()) {
    // Se il form non è valido, aggiungi la classe per la validazione
    form.classList.add('was-validated');
    return;
  }

  form.classList.add('was-validated');


  //let email = document.getElementById('email');
  //let password = document.getElementById('password');
  let roleDIP = "DIP";




  // ***** salvare dipendente nell'elenco dipendenti dell'azienda
  if (form.checkValidity()) {

    // Salva i dati dell'utente nel database
    set(refDB(db, 'Aziende/' + UserCreds.uid + '/DIPENDENTI/' + dipName), {
      Nome: dipName,
      //Email: email.value.trim(), // in caso da aggiungere nel futuro
      role: roleDIP,
      IDAZI: UserCreds.uid, // utile?
      isPreposto: isPreposto,
      scadenzaPreposto: scadenzaPreposto.valueOf(),
      isAntincendio: isAntincendio,
      scadenzaAntincendio: scadenzaAntincendio.valueOf(),
      isEmergency: isEmergency,
      abc: abc.valueOf(),
      scadenzaPS: scadenzaPS.valueOf(),
      scadenzaIS: scadenzaIS.valueOf(),
      isResponsabile: isResponsabile,
      isUnilav: isUnilav,
      scadenzaUnilav: scadenzaUnilav.valueOf(),
      scadenzaFormazioneS: scadenzaFormazioneS.valueOf(),

    })
      .then(() => {
        // Esegui la registrazione con account
        /*if (email && password && isResponsabile) {
          console.log("Entrato nella registrazione");
          createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
            .then((credentials) => {
              alert("Account creato con successo.");
              console.log(credentials);

              set(refDB(db, 'UsersList/' + credentials.user.uid), {
                Nome: dipName,
                email: email.value.trim(),
                role: roleDIP,
                AZI: UserCreds.uid,
              })
                .then(() => {
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
        }*/

        if (false) { // registrazione utente, da fare
          console.log("Iniziando la registrazione dell'utente");
          createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
            .then((credentials) => {
              alert("Account creato con successo.");
              console.log(credentials);

              set(refDB(db, 'UsersList/' + credentials.user.uid), {
                Nome: dipName,
                email: email.value.trim(),
                role: roleDIP,
                AZI: UserCreds.uid,
              })
                .then(() => {
                  console.log("Dati utente salvati con successo nel database.");
                  window.location.href = 'dipendenti.html';
                })
                .catch((error) => {
                  console.error("Errore durante il salvataggio dei dati utente nel database:", error);
                });
            })
            .catch((error) => {
              console.error("Errore durante la creazione dell'utente:", error);
              alert(error.message);
            });
        }

        console.log("Dati utente salvati con successo nel database.");

        window.location.href = 'dipendenti.html';

      })



  }


});



