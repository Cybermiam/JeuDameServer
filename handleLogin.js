const { findJoueurByName, createJoueur } = require("./dbCRUD");

async function handleLogin(
  parsedMessage,
  connection,
  connectedUsernames,
  joueurs
) {
  const joueur = joueurs.find(
    (joueur) => joueur.nomDeJoueur === parsedMessage.nomDeJoueur
  );
  if (joueur) {
    // si joueur existe, valider mod de passe et envoyer login success
    if (joueur.password !== parsedMessage.password) {
      connection.send(JSON.stringify({ type: "Login", success: false }));
      return;
    } else {
      const message = { type: "Login", success: true, joueur: joueur };
      connectedUsernames.push(joueur.nomDeJoueur);
      connection.send(JSON.stringify(message));
    }
  } else {
    // si joueur n''existe pas, le cree et envoyer login success

    const newJoueur = await createJoueur(
      parsedMessage.nomDeJoueur,
      parsedMessage.password
    );
    connection.send(
      JSON.stringify({ type: "Login", success: true, joueur: newJoueur })
    );
  }
}

module.exports = { handleLogin };
