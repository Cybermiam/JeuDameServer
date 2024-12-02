const http = require('http');
const plateau = require('./plateau');

const server = http.createServer();
const users = [
    { username: 'admin', password: 'admin' },
    { username: 'player1', password: 'player1' },
    { username: 'player2', password: 'player2' },
];



let connectedUsers = [];
let fileAttente = [];
let partiesEnCours = [];

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
    
    function getPlayerFromConnection(connection) {
        let player;
        connectedUsers.forEach(user => {
            if (user.connection === connection) {
                player = user;
            }
        });
        return player;
    }

    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', function(message) {
        message = JSON.parse(message.utf8Data);
        console.log('Message received', message.type);
        if (message.type === 'login') {
            const user = users.find((user) => user.username === message.username && user.password === message.password);
            if (user) {
                message = { type: 'login', response: true, username: user.username };
                connectedUsers.push({ username: user.username, connection: connection, color: null });
                console.log(connectedUsernames);
                connection.send(JSON.stringify(message));
            } else {
                //ajouter un nouveau compte
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
        } else if (message.type === 'move') {
            plateau.addPiece(message.x_arrivee, message.y_arrivee, message.color);
            plateau.removePiece(message.x_depart, message.y_depart);
        
        } else if (message.type === 'start') {
            player = getPlayerFromConnection(connection);
            fileAttente.push(player);
            if (fileAttente.length === 2) {
                const randomColor = Math.floor(Math.random() * 2) + 1;
                fileAttente[0].color = randomColor === 1 ? 'white' : 'black';
                fileAttente[1].color = randomColor === 1 ? 'black' : 'white';
                let message = { type: 'start' , joueur1: fileAttente[0], joueur2: fileAttente[1]};
                fileAttente.forEach(player => {
                    player.connection.send(JSON.stringify(message));
                });
                let grid = Array(8).fill(null).map(() => Array(8).fill(null));
                plateau.init(grid);
                partie = { joueur1: fileAttente[0], joueur2: fileAttente[1], grid: grid };
                partiesEnCours.push(partie);
                fileAttente = [];
            }
        } else {
            connection.sendUTF('message recu mais type inconnu');
        }

    });
    connection.on('close', function(reasonCode, description) {
        let index = connectedUsers.indexOf(connection);
        connectedUsers.splice(index, 1);
        console.log('Client disconnected');
    });
    });