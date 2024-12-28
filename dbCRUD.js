const { Joueur, Match } = require("./models");

// Function to find a joueur by name (for login, etc.)
async function findJoueurByName(name) {
  return await Joueur.findOne({ nomDeJoueur: name });
}

// Function to create a new joueur
async function createJoueur(name, password) {
  const newJoueur = new Joueur({ nomDeJoueur: name, password });
  return await newJoueur.save();
}

// Function to create a new match
async function createMatch(joueur1, joueur2, couleur1, couleur2, debut) {
  const newMatch = new Match({
    idDeJoueur1: joueur1,
    idDeJoueur2: joueur2,
    couleurDeJoueur1: couleur1,
    couleurDeJoueur2: couleur2,
    heureDebut: debut,
  });
  return await newMatch.save();
}

// Function to update the match state
async function updateMatchState(matchId, etat, boardState) {
  return await Match.findByIdAndUpdate(matchId, {
    etatDuMatch: etat,
    etatDuTableau: boardState,
  });
}

module.exports = {
  findJoueurByName,
  createJoueur,
  createMatch,
  updateMatchState,
};
