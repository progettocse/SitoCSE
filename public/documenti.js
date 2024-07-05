import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// Your web app's Firebase configuration
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
const storage = getStorage(app);
const messaging = getMessaging(app);
/*
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch((err) => {
    console.error('Service Worker registration failed:', err);
  });
}*/
/*
// Request notification permission and get token
Notification.requestPermission()
  .then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return getToken(messaging, { vapidKey: 'BL4a30xsDVrYO3vo1Rr5Lt2Ebomy6trb_hJxOykSDil6HeJjgS90klYhdGsblvqnCgKAquix9zf8bH1PvUqQ_f4' });
    } else {
      throw new Error('Notification permission not granted.');
    }
  })
  .then((token) => {
    console.log('Token:', token);
    // Save the token in the server database or wherever you prefer
  })
  .catch((err) => {
    console.error('Unable to get permission to notify or get token.', err);
  });

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Show notification as desired
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'Icon.png' // Change this to your icon path
  };

  if (Notification.permission === 'granted') {
    new Notification(notificationTitle, notificationOptions);
  }
});
*/
document.getElementById('uploadButton').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (file) {
    const storageRef = ref(storage, 'documenti/' + file.name);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Caricamento completato', snapshot);
      loadFiles();
      //sendNotification('Documento Caricato', `Il documento ${file.name} è stato caricato con successo.`);
    });
  } else {
    alert('Seleziona un file prima di caricarlo.');
  }
});

// recupera documenti da storage
function loadFiles() {
  const listRef = ref(storage, 'documenti/');
  listAll(listRef)
    .then((res) => {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          const link = document.createElement('a');
          link.href = url;
          link.textContent = itemRef.name;
          link.classList.add('d-block', 'mb-2');
          fileList.appendChild(link);
        });
      });
    })
    .catch((error) => {
      console.error('Errore nel caricamento dei file', error);
    });
}

function sendNotification(title, body) {
  const notificationOptions = {
    body: body,
    icon: 'Icon.png' // Change this to your icon path
  };

  if (Notification.permission === 'granted') {
    new Notification(title, notificationOptions);
  }
}



// Carica i file all'avvio della pagina
document.addEventListener('DOMContentLoaded', loadFiles);
