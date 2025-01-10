const { Joueur, Match } = require("./models");

// Function to find a joueur by name (for login, etc.)
async function findJoueurByName(name) {
  return await Joueur.findOne({ username: name });
}

// Function to create a new joueur
async function createJoueur(name, password) {
  const newJoueur = new Joueur({ username: name, password });
  try {
    const savedJoueur = await newJoueur.save();
    console.log("New joueur saved:", savedJoueur);
    return savedJoueur; // Return le joueur sauvegarde
  } catch (error) {
    console.error("Error saving joueur:", error);
    throw error; // Re-throw the error so that the caller can handle it
  }
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

async function getMatchById(matchId) {
  return await Match.findById;
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
