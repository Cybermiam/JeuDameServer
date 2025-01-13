const { updateJoueur } = require("./dbCRUD");

matchesEnCours = [];

function creerMatch(joueur1, joueur2) {
  const colors = ["B", "W"];
  const joueur1Color = colors[Math.floor(Math.random() * colors.length)];
  const joueur2Color = joueur1Color === "B" ? "W" : "B";
  joueur1.color = joueur1Color;
  joueur2.color = joueur2Color;

  const newMatch = {
    joueur1: joueur1,
    joueur2: joueur2,
    etat: "en cours",
    table: initializeTable(),
  };
  // newMatch.table = rotateTableClockwise(newMatch.table);
  prettyPrintTable(newMatch.table);
  matchesEnCours.push(newMatch);
  console.log("New match created:", newMatch);

  message = JSON.stringify({
    type: "debutMatch",
    joueur1: joueur1.username,
    joueur1Color: joueur1Color,
    joueur2: joueur2.username,
    joueur2Color: joueur2Color,
  });

  sendMessageToPlayers(newMatch, message);

  return newMatch;
}

function sendMessageToPlayers(match, message) {
  match.joueur1.connection.send(message);
  match.joueur2.connection.send(message);
}

function initializeTable() {
  const rows = 8;
  const cols = 8;
  const table = [];

  for (let i = 0; i < rows; i++) {
    table[i] = [];
    for (let j = 0; j < cols; j++) {
      if (i < 3 && (i + j) % 2 === 1) {
        table[i][j] = "B"; // Black checkers
      } else if (i > 4 && (i + j) % 2 === 1) {
        table[i][j] = "W"; // White checkers
      } else {
        table[i][j] = null; // Empty square
      }
    }
  }

  return table;
}

function prettyPrintTable(table) {
  const rows = table.length;
  const cols = table[0].length;
  const colLabels =
    "  " +
    Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i)).join(
      " "
    ); // A to H

  console.log(colLabels); // Print column labels

  for (let i = 0; i < rows; i++) {
    const rowLabel = i; // Top row starts at 0
    const row = table[i].map((cell) => (cell === null ? "." : cell)).join(" ");
    console.log(`${rowLabel} ${row}`); // Print row label followed by the row content
  }
}

function rotateTableClockwise(table) {
  const N = table.length;
  const newTable = Array.from({ length: N }, () => Array(N).fill(null));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      newTable[j][N - 1 - i] = table[i][j];
    }
  }

  return newTable;
}

function getMatch(joueur) {
  return matchesEnCours.find(
    (m) => m.joueur1 === joueur || m.joueur2 === joueur
  );
}

function abandonMatch(joueur) {
  match = getMatch(joueur);
  adversaire = match.joueur1 === joueur ? match.joueur2 : match.joueur1;
  message = JSON.stringify({
    type: "finMatch",
    winner: adversaire.username,
  });
  matchesEnCours = matchesEnCours.filter((m) => m !== match);
  updateJoueur(adversaire, "victoire");
  updateJoueur(joueur, "defaite");
  sendMessageToPlayers(match, message);
}

module.exports = {
  creerMatch,
  sendMessageToPlayers,
  initializeTable,
  getMatch,
  prettyPrintTable,
  rotateTableClockwise,
  abandonMatch,
};
