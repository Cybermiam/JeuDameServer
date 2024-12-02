const http = require('http');
const server = http.createServer();
const users = [
    { username: 'admin', password: 'admin' },
    { username: 'player1', password: 'player1' },
    { username: 'player2', password: 'player2' },
];


let connectedUsers = [];
let connectedUsernames = [];

server.listen(9898);

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
httpServer: server
});

// Mise en place des événements WebSockets
wsServer.on('request', function(request) {
    console.log('Connection from origin');
    const connection = request.accept(null, request.origin);
    connectedUsers.push(connection);
    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', function(message) {
        message = JSON.parse(message.utf8Data);
        console.log('Message received', message.type);
        if (message.type === 'login') {
            const user = users.find((user) => user.username === message.username && user.password === message.password);
            if (user) {
                message = { type: 'login', response: true, username: user.username };
                connectedUsernames.push(user.username);
                console.log(connectedUsernames);
                connection.send(JSON.stringify(message));
            } else {
                message = { type: 'login', response: false };
                connection.send(JSON.stringify(message));
            }
        } else if (message.type === 'logout') {
            message = { type: 'logout' };
            connection.send(JSON.stringify(message));
            index = connectedUsernames.indexOf(message.username);
            connectedUsernames.splice(index, 1);
            console.log(connectedUsernames);
            
            
        } else if (message.type === 'ping') {
            let userToPing;
            connectedUsernames.forEach(user => {
                if (user !== message.username) {
                    userToPing = user;
                }
            });
            message = { type: 'pong', username: userToPing };
            connectedUsers.forEach(user => {
                user.send(JSON.stringify(message));
            });
            console.log('Ping from client');
        } 
        
        
        else {
            connection.sendUTF('message recu mais type inconnu');
        }

    });
    connection.on('close', function(reasonCode, description) {
        let index = connectedUsers.indexOf(connection);
        connectedUsers.splice(index, 1);
        console.log('Client disconnected');
    });
    });