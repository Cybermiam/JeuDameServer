const { getConnectedUsers, getUser, removeUser } = require("./handleUsers");

async function handleLogout(username) {
  joueur = getUser(username);
  removeUser(joueur);
  message = { type: "logout", success: true };
  joueur.connection.send(JSON.stringify(message));
}

module.exports = { handleLogout };
