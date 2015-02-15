
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var user = 0;
io.on('connection', function(client){
    client.emit('messages', 'Der Chatserver sagt hallo!');
    console.log('new user!');
    client.on('join', function(name){
        name = name ? name : "Nutzer" + ++user;
        client.emit('messages', 'Neuer Nutzer: ' + name);
        client.nickname = name;
        client.broadcast.emit('messages', 'Neuer Nutzer: ' + name);
        console.log('joined: ' + name);
    });
    client.on('messages', function(message){
        client.emit('messages', client.nickname + ': ' + message);
        client.broadcast.emit('messages', client.nickname + ': ' + message);
    });
});

app.use("/js", express.static(__dirname + '/js'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html', {});
});
server.listen(8080);