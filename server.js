const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST"],
   }
});

let roomUsers = 0;

io.on("connection", (socket) => {
    console.log(`A client has connected... ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        updateUsersInRoom(room);
        console.log(`user ${socket.id} has joined ${room}`);
        console.log(socket.rooms);
    });

    socket.on("disconnecting", () => {
        console.log(`user ${socket.id} disconnected`);
        // let room = Object.keys(socket.rooms)[0];
        // console.log(socket.rooms);
        // updateUsersInRoom(room);
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                console.log(room);
                socket.leave(room);
                updateUsersInRoom(room);
            }
          }
    }); 
});

async function updateUsersInRoom(room) {
    io.to(room).emit("newUserCount", (await io.in(room).fetchSockets()).length);
};
 

server.listen(3001, ()=> {console.log('Server chal raha hain BC!')});
