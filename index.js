var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var anonymousNum = 1;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    var nickname = '一位不愿透露姓名的用户' + anonymousNum;
    anonymousNum++;

    // 该用户加入聊天室
    // 广播消息
    io.emit('someone connected');
    // 向该用户发送其匿名号
    socket.emit('user anonymousNum', anonymousNum);
    
    // 该用户发了一条消息，广播消息
    socket.on('chat message', (message) => {
        console.log(message);
        message = nickname + ': '+ message;
        console.log(message);
        io.emit('chat message broadcast', message);
    });

    // 该用户修改昵称
    socket.on('change nickname', (message) => {
        nickname = message;
        console.log("用户改名为：" + nickname);
        //io.emit('chat message broadcast', message);
    });

    // 该用户断开连接，广播消息
    socket.on('disconnect', () => {
        var message = nickname + '断开连接'
        console.log(message);
        io.emit('someone disconnected', message);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});