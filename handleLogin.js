const { findJoueurByName, createJoueur } = require("./dbCRUD");
const { addUser } = require("./handleUsers");

async function handleLogin(
  parsedMessage,
  connection,
  connectedUsernames,
  joueurs
) {
  console.log("Parsed message:", parsedMessage);

  // const joueur = joueurs.find(
  //   (joueur) => joueur.nomDeJoueur === parsedMessage.nomDeJoueur
  // );

  const joueur = await findJoueurByName(parsedMessage.username);

  if (joueur) {
    if (joueur.password !== parsedMessage.password) {
      connection.send(JSON.stringify({ type: "login", success: false }));
      return;
    } else {
      // si joueur existe, valider mod de passe et envoyer login success
      const message = { type: "login", success: true, joueur: joueur };
      connection.send(JSON.stringify(message));
      let player = { username: parsedMessage.username, connection: connection };
      addUser(player);
    }
  } else {
    if (!parsedMessage.username || !parsedMessage.password) {
      console.error("il manque: username ou password", parsedMessage);
      connection.send(
        JSON.stringify({
          type: "login",
          success: false,
          message: "Manquent des informations necessaires",
        })
      );
      return;
    }
    // si joueur n'existe pas, le creer et envoyer login success
    const newJoueur = await createJoueur(
      parsedMessage.username,
      parsedMessage.password
    );
    let joueur = { username: parsedMessage.username, connection: connection };
    addUser(joueur);
    connection.send(
      JSON.stringify({ type: "login", success: true, joueur: newJoueur })
    );
  }
}

module.exports = { handleLogin };
