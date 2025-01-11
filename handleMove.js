const { getUser } = require("./handleUsers");
const {
  getMatch,
  sendMessageToPlayers,
  prettyPrintTable,
} = require("./handleMatch");

async function handleMove(parsedMessage) {
  const user = getUser(parsedMessage.username);
  const match = getMatch(user);

  console.log("Parsed message:", parsedMessage);

  const { x_depart, y_depart, x_arrivee, y_arrivee, couleur } = parsedMessage;
  const table = match.table;

  // Check if the move is allowed
  const piece = table[y_depart][x_depart]; // Use [y][x] indexing (server-side)
  if (piece !== couleur[0].toUpperCase()) {
    console.log("Invalid move: piece does not match the player's color");
    return;
  }

  const dx = x_arrivee - x_depart;
  const dy = y_arrivee - y_depart;

  // Ensure the move is diagonal and not too long
  if (Math.abs(dx) !== Math.abs(dy) || Math.abs(dx) > 2) {
    console.log("Invalid move: not a valid diagonal move");
    return;
  }

  if (Math.abs(dx) === 2) {
    const x_middle = (x_depart + x_arrivee) / 2;
    const y_middle = (y_depart + y_arrivee) / 2;
    const middle_piece = table[y_middle][x_middle]; // Intermediate cell

    // Check if there's an opponent piece to capture
    if (
      middle_piece === null ||
      middle_piece[0].toUpperCase() === couleur[0].toUpperCase()
    ) {
      console.log("Invalid move: no opponent piece to capture");
      return;
    }

    // Capture the opponent piece
    table[y_middle][x_middle] = null;
  }

  // Check if the target cell is empty
  if (table[y_arrivee][x_arrivee] !== null) {
    console.log("Invalid move: target cell is not empty");
    return;
  }

  // Update the table with the move
  table[y_depart][x_depart] = null;
  table[y_arrivee][x_arrivee] = piece;

  // Log the updated board
  prettyPrintTable(table);

  // Send the move to both players, adjusting for rotation if necessary
  const rotatedMessage = {
    type: "moveReturn",
    x_depart: parseInt(x_depart), // Send rotated coordinates for client
    y_depart: parseInt(y_depart),
    x_arrivee: parseInt(x_arrivee),
    y_arrivee: parseInt(y_arrivee),
  };

  sendMessageToPlayers(match, JSON.stringify(rotatedMessage));
}

module.exports = { handleMove };
