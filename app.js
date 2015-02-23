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

var _userlist = {};

io.sockets.on('connection', function (client) {
    client.on('join', function (nickname) {
        redisClient.lrange('messages', 0, -1, function(err, storedMessages){
            storedMessages = storedMessages.reverse();
            storedMessages.forEach(function (storedMessage) {
                storedMessage = JSON.parse(storedMessage);
                client.emit("messages", {
                    nickname: storedMessage.nickname,
                    text: storedMessage.text
                });
            });
        });
        client.emit('messages', {
            nickname: 'Captain Server',
            text: 'Arrr ' + nickname + ', our new pirate!'
        });
        _userlist[client.id] = nickname;
        client.nickname = nickname;
        client.broadcast.emit('messages', {
            nickname: 'Captain Server',
            text: 'We got a new pirate on board! Arrr, ' + nickname + '!'
        });
        client.emit('users', _userlist);
        client.broadcast.emit('users', _userlist);
    });
    client.on('disconnect', function(data){
        delete _userlist[client.id];
        client.emit('users', _userlist);
        client.broadcast.emit('users', _userlist);
    });
    client.on('messages', function (message) {
        client.emit('messages', {
            nickname: 'me',
            text: message.text
        });
        client.broadcast.emit('messages', {
            nickname: client.nickname,
            text: message.text
        });
        storeMessage(client.nickname, message.text);
    });
});

app.use("/", express.static(__dirname + '/public'));

server.listen(8080);
