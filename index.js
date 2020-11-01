var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // socket 接收到 chat message
    socket.on('chat message', (message) => {
        console.log("message: " + message);
        io.emit('chat message broadcast', message);
    });

    // socket 接收到断开连接
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});