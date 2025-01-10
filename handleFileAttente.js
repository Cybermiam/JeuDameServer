const { creerMatch } = require("./handleMatch");

let fileAttente = [];

function addUserToQueue(joueur) {
  fileAttente.push(joueur);
  if (fileAttente.length === 2) {
    console.log("2 joueurs dans la file d'attente");
    creerMatch(fileAttente[0], fileAttente[1]);
    fileAttente = [];
  }
}

function afficherListeAttente() {
  console.log("dans la file d'attente: ", fileAttente);
}

function removeUserFromQueue(joueur) {
  fileAttente = fileAttente.filter((u) => u !== joueur);
}

module.exports = { addUserToQueue, afficherListeAttente, removeUserFromQueue };
