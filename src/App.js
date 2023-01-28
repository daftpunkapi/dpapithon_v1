import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const cursorUrlArray = [
  'https://icons.iconarchive.com/icons/svengraph/daft-punk/256/Daft-Punk-Guyman-Off-icon.png', 
  'https://icons.iconarchive.com/icons/everaldo/starwars/128/Darth-Vader-icon.png', 
  'https://icons.iconarchive.com/icons/everaldo/starwars/128/clone-old-icon.png',
  'https://icons.iconarchive.com/icons/svengraph/daft-punk/256/Daft-Punk-Thomas-On-icon.png'
];

const socket = io.connect("http://localhost:3001");

function App() {
  const [userCount, setUserCount] = useState("");
  const[otherCursor, setOtherUser] = useState({x:0, y:0});

  const [cursorUrl, setCursorUrl] = useState(cursorUrlArray[0]);
  
  useEffect(() => {
    socket.on("newUserCount", (count) => {
      setUserCount(count);
    });

    function handleMouseMove(event){
      socket.emit("mouseMove", {x: event.clientX, y: event.clientY});
    }

    // Add event listener for mouse movement {part of DOM elemen}
    document.addEventListener("mousemove", handleMouseMove);

    // Handle broadcasted mouseMoved event from server
    socket.on("mouseMoved", (data) => {
      setOtherUser({x: data.x, y: data.y});
    });
    
    setCursorUrl(cursorUrlArray[Math.floor(Math.random() * cursorUrlArray.length)]);

    // Listen to removeCursor event and remove cursor element from DOM
    // socket.on("removeCursor", (socketId) => {
    //   const cursor = document.getElementById(`cursor-${socketId}`);
    //   if (cursor) {
    //       cursor.remove();
    //   }
    // });

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };

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
    
      <div
        className='other-cursor'
        style={{
          left: otherCursor.x,
          top: otherCursor.y,
          backgroundImage: `url(${cursorUrl})`
        }} />
    </div>
  );
}

export default App;
