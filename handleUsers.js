let connectedUsers = [];
function handleUsers(parsedMessage) {
  console.log("Parsed message:", parsedMessage);
}

function addUser(user) {
  connectedUsers.push(user);
}

function removeUser(user) {
  connectedUsers = connectedUsers.filter((u) => u !== user);
}

function getUser(username) {
  return connectedUsers.find((u) => u.username === username);
}

function getConnectedUsers() {
  return connectedUsers;
}

module.exports = {
  handleUsers,
  addUser,
  removeUser,
  getUser,
  getConnectedUsers,
};
