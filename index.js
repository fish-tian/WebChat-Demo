var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var anonymousNum = 0;
var users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    var userid = anonymousNum;
    anonymousNum++;
    users[userid] = '一位不愿透露姓名的用户' + userid;

    // 该用户加入聊天室
    // 向该用户发送其统一昵称
    socket.emit('user anonymousname', users[userid]);
    // 广播消息
    io.emit('someone connected', users);
    
    // 该用户发了一条消息，广播消息
    socket.on('chat message', (message) => {
        console.log(message);
        message = nickname + ': '+ message;
        console.log(message);
        io.emit('chat message broadcast', message);
    });
    // 该用户修改昵称
    socket.on('change nickname', (message) => {
        users[userid] = message;
        console.log("用户改名为：" + users[userid]);
        io.emit('someone name changed', users);
        //io.emit('chat message broadcast', message);
    });
    // 该用户断开连接，广播消息
    socket.on('disconnect', () => {
        var message = users[userid] + '断开连接'
        console.log(message);
        delete users[userid];
        io.emit('someone disconnected', message);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});