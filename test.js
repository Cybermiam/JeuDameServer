let connectionStatus = false;
let connectedUser = null;

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('myRange').addEventListener('input', onRangeChange);
}

const ws = new WebSocket('ws://localhost:9898/');

ws.onopen = () => {
    console.log('Connected');
};
ws.onmessage = (message) => {
    message = JSON.parse(message.data);
    if (message.type === 'login') {
        if (message.response) {
            connectionStatus = true;
            connectedUser = message.username;
            console.log('Login success');
        } else {
            console.log('Login failed');
        }
    } else if (message.type === 'logout') {
        connectionStatus = false;
        connectedUser = null;
        console.log('Logout success');
    } else if (message.type === 'pong') { 
        if (message.username === connectedUser) {
            console.log('Ping from other player');
        }
    } else {
        console.log('Message received but type unknown');
    }
};
ws.onclose = () => {
    console.log('Disconnected');
};



