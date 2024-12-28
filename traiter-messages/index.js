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
      console.log("Login attempt:", parsedMessage);
      const user = users.find(
        (user) =>
          user.username === parsedMessage.username &&
          user.password === parsedMessage.password
      );
      if (user) {
        message = { type: "login", response: true, username: user.username };
        connectedUsernames.push(user.username);
        console.log(connectedUsernames);
        connection.send(JSON.stringify(message));
      } else {
        message = { type: "login", response: false };
        connection.send(JSON.stringify(message));
      }
      console.log("Login success");
      break;

    case "logout":
      message = { type: "logout" };
      connection.send(JSON.stringify(message));
      index = connectedUsernames.indexOf(parsedMessage.username);
      connectedUsernames.splice(index, 1);
      console.log(connectedUsernames);
      console.log("Logout success");
      break;

    case "Move":
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
