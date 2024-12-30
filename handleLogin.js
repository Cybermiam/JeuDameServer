const { findJoueurByName, createJoueur } = require("./dbCRUD");

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
    // si joueur existe, valider mod de passe et envoyer login success
    if (joueur.password !== parsedMessage.password) {
      connection.send(JSON.stringify({ type: "Login", success: false }));
      return;
    } else {
      const message = { type: "Login", success: true, joueur: joueur };
      connectedUsernames.push(joueur.username);
      connection.send(JSON.stringify(message));
    }
  } else {
    if (!parsedMessage.username || !parsedMessage.password) {
      console.error("il manque: username ou password", parsedMessage);
      connection.send(
        JSON.stringify({
          type: "Login",
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
    connection.send(
      JSON.stringify({ type: "Login", success: true, joueur: newJoueur })
    );
  }
}

module.exports = { handleLogin };
