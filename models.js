const mongoose = require("./db");

const joueurSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  matchesJoues: { type: Number, default: 0 },
  matchesGagnes: { type: Number, default: 0 },
  matchesPerdus: { type: Number, default: 0 },
  matchesNuls: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const matchSchema = new mongoose.Schema({
  idDeJoueur1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Joueur",
    required: true,
  },
  idDeJoueur2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Joueur",
    required: true,
  },
  couleurDeJoueur1: { type: Boolean, required: true },
  couleurDeJoueur2: { type: Boolean, required: true },
  etatDuMatch: { type: String, default: "En cours" },
  etatDuTableau: { type: [Array], default: [] },
  heureDebut: { type: Date, required: true },
  heureFin: { type: Date },
  idJoueurGagnant: { type: mongoose.Schema.Types.ObjectId, ref: "Joueur" },
});

const Joueur = mongoose.model("Joueur", joueurSchema);
const Match = mongoose.model("Match", matchSchema);

module.exports = { Joueur, Match };
