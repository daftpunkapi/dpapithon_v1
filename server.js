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

let cursorPositions = [];

io.on("connection", (socket) => {
    console.log(`A client has connected... ${socket.id}`);

    socket.on("join_room", (room) => {
        // Change in room check 
        // Updating cursors and presence
        if ((socket.rooms.size) > 1){
            let oldRoom = Array.from(socket.rooms)[1];
            console.log(oldRoom);
            socket.leave(oldRoom);
            updateUsersInRoom(oldRoom);
            cursorPositions.forEach(function(obj,index) {
                if (obj.socketId === socket.id) {
                    cursorPositions.splice(index,1);
                }
            });
        };
        // Joining new room
        socket.join(room);
        let newElement = {socketId : socket.id, room : room, x : 0, y : 0};
        cursorPositions.push(newElement);
        // console.log(cursorPositions);
        console.log(`user ${socket.id} has joined ${room}`);
        updateUsersInRoom(room);
        cursorUpdate(room,socket.id);
    });
    // Listening to mouse movement and updating cursor positions
    socket.on("mouseMove", (data) => {
        cursorPositions.forEach(function(obj){
            if(obj.socketId === socket.id){
                obj.x = data.x;
                obj.y = data.y;
            }
        });
        // Emitting cursors back to the room
        let room = Array.from(socket.rooms)[1];
        cursorUpdate(room,socket.id);
    })

    // Disconnecting room
    socket.on("disconnecting", () => {
        console.log(`user ${socket.id} disconnected`);
        let room = Array.from(socket.rooms)[1];
        let id = socket.id
        cursorPositions.forEach(function(obj,index) {
            if (obj.socketId === id) {
                cursorPositions.splice(index,1);
            }
        });
        socket.leave(room);
        cursorUpdate(room,id);
        updateUsersInRoom(room);
    }); 
});

async function updateUsersInRoom(room) {
    io.to(room).emit("newUserCount", (await io.in(room).fetchSockets()).length);
};

function cursorUpdate(room, id){
    let roomCursors = cursorPositions
        .filter(obj => obj.room === room)
        .map( obj => ({socketId: obj.socketId, x: obj.x, y: obj.y}));
    io.to(room).emit("cursorUpdate", roomCursors);
    // console.log(cursorPositions);
    console.log(roomCursors);
};

server.listen(3001, ()=> {console.log('Server chal raha hain BC!')});