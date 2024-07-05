import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//const db = getDatabase();
const dbref = ref(db);



const cronoprogrammaSnapshot = await get(child(dbref, 'Cantieri/' + UserData.cantiere.Nome));
  if(cronoprogrammaSnapshot.exists){
    console.log("ESISTE");

    const elencoAziendeCronoprogramma = cronoprogrammaSnapshot.val();

    for(let azienda in elencoAziendeCronoprogramma){
      console.log(azienda);

    }

  }


document.addEventListener('DOMContentLoaded', function () {
 /* var data = [
    {
      "name": "Activities",
      "actualStart": "2024-06-20",
      "actualEnd": "2024-08-25",
      "children": [
        {
          "name": "Draft plan",
          "actualStart": "2024-06-20",
          "actualEnd": "2024-07-20"
        },
        {
          "name": "Board meeting",
          "actualStart": "2024-06-20",
          "actualEnd": "2024-07-20"
        },
        {
          "name": "Research option",
          "actualStart": "2024-06-20",
          "actualEnd": "2024-07-20"
        },
        {
          "name": "Final plan",
          "actualStart": "2024-06-20",
          "actualEnd": "2024-07-20"
        }
      ]
    }
  ];

  var treeData = anychart.data.tree(data, 'as-tree');

  // Create a project gantt chart
  var chart = anychart.ganttProject();

  // Set the data
  chart.data(treeData);

  // Fit elements to the width of the timeline
  chart.fitAll();

  // Set the position of the splitter to match the first column
  chart.dataGrid().fixedColumns(true);

  // Enable and configure the chart title
  var title = chart.title();
  title.enabled(true);
  title
    .text('Project Schedule')
    .fontSize(18)
    .fontWeight(600)
    .fontColor('#b32e3c')
    .padding(10);

  // Customize the color of the bars
  var elements = chart.getTimeline().elements();
  elements.normal().fill('#e96a7b 0.75');
  elements.normal().stroke('#db4e50');

  // Enable labels
  elements.labels().enabled(true);
  elements.labels().fontColor('White');

  // Set the row height
  chart.defaultRowHeight(25);

  // Set the header height
  chart.headerHeight(95);

  // Enable html for the data grid tooltip
  chart.dataGrid().tooltip().useHtml(true);

  // Configure the tooltips of the timeline
  chart.getTimeline().tooltip().useHtml(true);

  chart.getTimeline().tooltip().title(false);
  chart.getTimeline().tooltip().separator(false);

  // Disable the first data grid column
  chart.dataGrid().column(0).enabled(false);

  // Set the width of the labels column
  chart.dataGrid().column(1).width(285);

  // Set the text of the first data grid column
  var column_1 = chart.dataGrid().column(1);
  column_1.labels()
    .useHtml(true);



  // Set the container id
  chart.container('gantt');

  // Draw the chart
  chart.draw();
});*/

function stringToUTC(dateString) {
  // Dividere la stringa in componenti giorno, mese e anno
  let [day, month, year] = dateString.split('/').map(Number);

  // Creare una data UTC usando i componenti. Il mese è zero-indicizzato.
  let utcDate = Date.UTC(year, month - 1, day);

  return utcDate;
}

let startDate = stringToUTC("20/01/2007");
let endDate = stringToUTC("20/07/2007");
let endProjectDate = stringToUTC("20/06/2007");


anychart.onDocumentReady(function() {
    var rawData = [
      {
        "name": "Activities",
        "actualStart": startDate,
        "actualEnd": endDate,
        "children": [
          {
            "name": "Draft plan",
            "baselineStart": startDate,
            "baselineEnd": endProjectDate
          },
          {
            "name": "Board meeting",
            "actualStart": "20/01/2007",
            "actualEnd": "20/03/2007"
          },
          {
            "name": "Research option",
            "actualStart": "20/01/2007",
            "actualEnd": "20/01/2007"
          },
          {
            "name": "Final plan",
            "actualStart": "20/01/2007",
            "actualEnd": "20/01/2007"
          }
        ]
      }
    ];
 
    // tree data settings
    var treeData = anychart.data.tree(rawData, "as-tree");
 
    // chart type
    var chart = anychart.ganttProject();
 
    // set chart data
    chart.data(treeData);
 
    // chart container
    chart.container('gantt');
    // initiate drawing
    chart.draw();
 
    //var json = chart.toJson();
    // uncomment the next line to see json in console or simply add watch on json variable
    // console.log(json);
    var credits = chart.credits();
    credits.enabled(false);
    credits.text("Cronoprogramma");

    chart.fitAll();
  });
});

