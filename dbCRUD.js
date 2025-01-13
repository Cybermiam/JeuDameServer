const { Joueur, Match } = require("./models");

// Function to find a joueur by name (for login, etc.)
async function findJoueurByName(name) {
  return await Joueur.findOne({ username: name });
}

// Function to create a new joueur
async function createJoueur(name, password) {
  try {
    const existingUser = await Joueur.findOne({ username: name });
    if (existingUser) {
      // Username already taken
      throw new Error(`Username "${name}" already exists`);
    }

    const newJoueur = new Joueur({ username: name, password });
    const savedJoueur = await newJoueur.save();
    console.log("New joueur saved:", savedJoueur);
    return savedJoueur; // Return the saved Joueur
  } catch (error) {
    console.error("Error saving joueur:", error);
    throw error; // Re-throw so the caller can handle or display the error
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

async function getJoueurId(username) {
  // First, we find the document
  const doc = await Joueur.findOne({ username });
  // Check if doc exists
  if (!doc) {
    return null; // or throw an error, depending on your logic
  }
  return doc._id;
}

async function updateJoueur(joueur, resultatMatch) {
  // We need to await the ID
  const joueurId = await getJoueurId(joueur.username);
  if (!joueurId) {
    console.log("Joueur not found in the database");
    return null; // or handle error
  }

  let update = {};
  if (resultatMatch === "victoire") {
    update = { $inc: { matchesGagnes: 1, matchesJoues: 1 } };
  } else if (resultatMatch === "defaite") {
    update = { $inc: { matchesPerdus: 1, matchesJoues: 1 } };
  } else {
    // match nul (draw)
    update = { $inc: { matchesNuls: 1, matchesJoues: 1 } };
  }

  // Use {new: true} if you want the updated document returned.
  return await Joueur.findByIdAndUpdate(joueurId, update, { new: true });
}

async function getPlayerStats() {
  let joueurs = await Joueur.find({});
  let res = [];
  for (let joueur of joueurs) {
    res.push({
      username: joueur.username,
      matchesJoues: joueur.matchesJoues,
      matchesGagnes: joueur.matchesGagnes,
      matchesPerdus: joueur.matchesPerdus,
      matchesNuls: joueur.matchesNuls,
    });
  }
  return res;
}
module.exports = {
  findJoueurByName,
  createJoueur,
  createMatch,
  updateMatchState,
  updateJoueur,
  getPlayerStats,
};
