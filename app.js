var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redisClient = require('redis').createClient();

function storeMessage(nickname, text) {
    var message = JSON.stringify({ nickname: nickname, text: text });
    redisClient.lpush('messages', message, function (err, res){
        redisClient.ltrim('messages', 0, 49);
    });
}

io.sockets.on('connection', function (client) {
    console.log('new connection!');
    client.on('join', function (name) {
        redisClient.lrange('messages', 0, -1, function(err, storedMessages){
            storedMessages = storedMessages.reverse();
            storedMessages.forEach(function (storedMessage) {
                console.log(storedMessage);
                storedMessage = JSON.parse(storedMessage);
                client.emit("messages", storedMessage.nickname + ': "' + storedMessage.text + '"');
            });
        });
        client.emit('messages', 'Server: "Hallo ' + name + '"');
        client.nickname = name;
        client.broadcast.emit('messages', 'Neuer Nutzer: "' + name + '"');
        console.log('joined: ' + name);
    });
    client.on('messages', function (message) {
        client.emit('messages', 'Ich: "' + message + '"');
        client.broadcast.emit('messages', client.nickname + ': "' + message + '"');
        storeMessage(client.nickname, message);
    });
});

app.use("/stuff", express.static(__dirname + '/stuff'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html', {});
});
server.listen(8080);