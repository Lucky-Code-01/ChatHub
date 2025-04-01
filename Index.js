const express = require('express');
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const app = express();
const users = {};

// convert express server to http
const server = http.createServer(app);

// now integrate or join the socket to http server
const io = new Server(server);

// middle warr
// Static files serve karna
app.use(express.static(path.join(__dirname, 'public', 'ChatHub')));

// established the connection
io.on('connection',(socket)=>{

    // to join new user
    socket.on('new-user-add',(name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    })

    // receive msg
    socket.on('send',(message)=>{
        socket.broadcast.emit('recive',{message:message,name:users[socket.id]})
    })

    // disconnet 
    socket.on('disconnect',(message)=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];

    })
})


server.listen(process.env.PORT || 8080,()=>{
    console.log("Server Running On Port :- http://localhost:8080");
})
