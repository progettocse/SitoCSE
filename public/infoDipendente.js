let UserDip = JSON.parse(sessionStorage.getItem("user-dipendente"));

console.log(UserDip);

// completare

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

const scadenzaISElement = card.querySelector(`#scadenzaIS-${dipendenti[dipendente].Nome.replace(/\s/g, '')}`);
if (scadenzaISElement) {
    let statusClassIS = getScadenzaFromRilascio(dipendenti[dipendente].scadenzaIS, 5);
    scadenzaISElement.classList.add(statusClassIS);
}