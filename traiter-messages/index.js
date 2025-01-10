const { handleLogin } = require("../handleLogin");
const { handleMove } = require("../handleMove");

function traiterMessages(
  parsedMessage,
  connection,
  connectedUsers,
  connectedUsernames,
  users
) {
  console.log("Message received:", parsedMessage);
  if (!parsedMessage.type) {
    console.log("Missing 'type' field in the message.");
    return;
  }

  switch (parsedMessage.type) {
    case "login":
      handleLogin(parsedMessage, connection, connectedUsernames, users);
      break;

    case "logout":
      message = { type: "logout" };
      connection.send(JSON.stringify(message));
      index = connectedUsernames.indexOf(parsedMessage.username);
      connectedUsernames.splice(index, 1);
      console.log(connectedUsernames);
      console.log("Logout success");
      break;

    case "startGame":
      console.log("Demarrer match");
      break;

    case "move":
      handleMove(parsedMessage);
      console.log("Move success");
      break;

    case "Joueur":
      console.log("Joueur success");
      break;

    case "Ping":
    case "Hello":
      let userToPing;
      connectedUsernames.forEach((user) => {
        if (user !== parsedMessage.username) {
          userToPing = user;
        }
      });
      message = { type: "pong", username: userToPing };
      connectedUsers.forEach((user) => {
        user.send(JSON.stringify(message));
      });
      console.log("Ping from client");
      break;

    default:
      console.log("Type de message inconnu");
  }
}

module.exports = traiterMessages;
