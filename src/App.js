import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userCount, setUserCount] = useState("");

  useEffect(() => {
    socket.on("newUserCount", (count) => {
      setUserCount(count);
    });
  },[]);

  return (
    <div className="App">
    <h1><b>DPAPI zindabad!</b></h1>
    <p>
    <button onClick={() => {
        socket.emit("join_room", "room1");
      }}>Join Room 1</button> 

    &nbsp;&nbsp;&nbsp;&nbsp;
    
    <button onClick={() => {
        socket.emit("join_room", "room2");
      }}>Join Room 2</button>
    </p>
    There are {userCount} users in the room.
    </div>
  );
}

export default App;
