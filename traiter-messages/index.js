const { handleLogin } = require("../handleLogin");
const { handleMove } = require("../handleMove");
const {
  handleUsers,
  addUser,
  removeUser,
  getUser,
  getConnectedUsers,
} = require("../handleUsers");
const {
  addUserToQueue,
  afficherListeAttente,
} = require("../handleFileAttente");
const { abandonMatch } = require("../handleMatch");
const { handleLogout } = require("../handleLogout");

let nbTour = 0;

function traiterMessages(parsedMessage, connection) {
  console.log("Message received:", parsedMessage);
  if (!parsedMessage.type) {
    console.log("Missing 'type' field in the message.");
    return;
  }

  switch (parsedMessage.type) {
    case "login":
      handleLogin(parsedMessage, connection);
      break;

    case "logout":
      handleLogout(parsedMessage.username);
      break;

    case "fileAttente":
      addUserToQueue(getUser(parsedMessage.username));

      afficherListeAttente();
      break;

    case "move":
      handleMove(parsedMessage);
      console.log("Move success");
      nbTour++;
      break;

    case "Joueur":
      console.log("Joueur success");
      break;

    case "Ping":
    case "Hello":
      let userToPing;

      message = { type: "pong", username: userToPing };

      console.log("Ping from client");
      break;
    case "abandon":
      abandonMatch(getUser(parsedMessage.username));

    default:
      console.log("Type de message inconnu");
  }
}

module.exports = traiterMessages;
