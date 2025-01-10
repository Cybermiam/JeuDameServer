const { updateMatchState } = require("./dbCRUD");

async function handleMove(parsedMessage) {
  console.log("Parsed message:", parsedMessage);
}
module.exports = { handleMove };
