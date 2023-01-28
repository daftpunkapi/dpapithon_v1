const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const grahak = require('./grahak');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST"],
   }
});

io.on("connection", (socket) => {
    console.log(`A client has connected... ${socket.id}`);

    socket.on("join_room", (room) => {
        if ((socket.rooms.size) > 1){
            let oldRoom = Array.from(socket.rooms)[1];
            console.log(oldRoom);
            socket.leave(oldRoom);
            updateUsersInRoom(oldRoom);
        };
        socket.join(room);
        updateUsersInRoom(room);
        console.log(`user ${socket.id} has joined ${room}`);
    });

    socket.on("disconnecting", () => {
        console.log(`user ${socket.id} disconnected`);
        let room = Array.from(socket.rooms)[1];
        socket.leave(room);
        updateUsersInRoom(room);
    }); 
});

async function updateUsersInRoom(room) {
    io.to(room).emit("newUserCount", (await io.in(room).fetchSockets()).length);
};
 

server.listen(3001, ()=> {console.log('Server chal raha hain BC!')});