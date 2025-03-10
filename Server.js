const http = require("http");
const traiterMessages = require("traiter-messages");
const { handleLogin } = require("./handleLogin");
const { getUserFromConnection, removeUser } = require("./handleUsers");
const { abandonMatch } = require("./handleMatch");
const { removeUserFromQueue } = require("./handleFileAttente");

const server = http.createServer();

server.listen(9898);

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require("websocket").server;
const wsServer = new WebSocketServer({
  httpServer: server,
});

// Mise en place des événements WebSockets
wsServer.on("request", function (request) {
  console.log("Connection from origin");
  const connection = request.accept(null, request.origin);
  // Ecrire ici le code qui indique ce que l'on fait en cas de
  // réception de message et en cas de fermeture de la WebSocket
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      try {
        const parsed = JSON.parse(message.utf8Data);
        traiterMessages(parsed, connection);
      } catch (err) {
        console.error("Erreur de parsing JSON:", err);
      }
    } else {
      console.log(
        "Received a non-UTF8 message. Ignoring or handle separately."
      );
    }
  });
  connection.on("close", function (reasonCode, description) {
    joueur = getUserFromConnection(connection);

    console.log(joueur);
    try {
      abandonMatch(joueur);
    } catch (error) {
      console.error("Error abandoning match:", error.message);
    }
    try {
      removeUserFromQueue(joueur);
    } catch (error) {
      console.error("Error removing user from queue:", error.message);
    }
    removeUser(joueur);
  });
});
