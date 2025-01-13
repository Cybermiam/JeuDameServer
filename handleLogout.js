const { getConnectedUsers, getUser, removeUser } = require("./handleUsers");
const { removeUserFromQueue } = require("./handleFileAttente");

async function handleLogout(username) {
  joueur = getUser(username);
  removeUserFromQueue(joueur);
  removeUser(joueur);
  message = { type: "logout", success: true };
  joueur.connection.send(JSON.stringify(message));
}

module.exports = { handleLogout };
