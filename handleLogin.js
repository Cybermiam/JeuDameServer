const { findJoueurByName, createJoueur } = require("./dbCRUD");
const { addUser } = require("./handleUsers");

async function handleLogin(
  parsedMessage,
  connection,
  connectedUsernames,
  joueurs
) {
  console.log("Parsed message:", parsedMessage);

  const joueur = await findJoueurByName(parsedMessage.username);

  if (joueur) {
    // If the player exists, validate password
    if (joueur.password !== parsedMessage.password) {
      connection.send(JSON.stringify({ type: "login", success: false }));
      return;
    } else {
      // If password is correct, log in
      const message = { type: "login", success: true, joueur: joueur };
      connection.send(JSON.stringify(message));
      let player = { username: parsedMessage.username, connection: connection };
      addUser(player);
    }
  } else {
    if (!parsedMessage.username || !parsedMessage.password) {
      console.error("Missing username or password:", parsedMessage);
      connection.send(
        JSON.stringify({
          type: "login",
          success: false,
          message: "Manquent des informations necessaires",
        })
      );
      return;
    }

    // Attempt to create the new joueur
    try {
      const newJoueur = await createJoueur(
        parsedMessage.username,
        parsedMessage.password
      );
      let joueur = { username: parsedMessage.username, connection: connection };
      addUser(joueur);
      connection.send(
        JSON.stringify({ type: "login", success: true, joueur: newJoueur })
      );
    } catch (error) {
      console.error("Error creating joueur:", error.message);

      // If username already exists or other error, return success: false
      connection.send(
        JSON.stringify({
          type: "login",
          success: false,
          message: error.message,
        })
      );
    }
  }
}

module.exports = { handleLogin };
