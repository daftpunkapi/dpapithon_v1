import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

// const cursorUrlArray = [
//   'https://icons.iconarchive.com/icons/svengraph/daft-punk/256/Daft-Punk-Guyman-Off-icon.png', 
//   'https://icons.iconarchive.com/icons/everaldo/starwars/128/Darth-Vader-icon.png', 
//   'https://icons.iconarchive.com/icons/everaldo/starwars/128/clone-old-icon.png',
//   'https://icons.iconarchive.com/icons/svengraph/daft-punk/256/Daft-Punk-Thomas-On-icon.png'
// ];

const socket = io.connect("http://192.168.106.88:3001");

function App() {
  const [userCount, setUserCount] = useState("");
  const[otherCursors, setOtherUsers] = useState([]);

  // const [cursorUrl, setCursorUrl] = useState("");
  
  useEffect(() => {
    socket.on("newUserCount", (count) => {
      setUserCount(count);
    });

    function handleMouseMove(event){
      socket.emit("mouseMove", {x: event.clientX, y: event.clientY});
    }

    // Add event listener for mouse movement {part of DOM element}
    document.addEventListener("mousemove", handleMouseMove);

    // Handle broadcasted mouseMoved event from server
    socket.on("cursorUpdate", (data) => {
      setOtherUsers(data);
    });
    
    // setCursorUrl(cursorUrlArray[Math.floor(Math.random() * cursorUrlArray.length)]);


    // Remove event listener when component unmounts
    // return () => {
    //   document.removeEventListener("mousemove", handleMouseMove);
    // };

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
    {otherCursors.map((cursor) => {
      if(cursor.socketId !== socket.id){
      return(
        <div 
          key={cursor.socketId} 
          className="other-cursor" 
          style={{
            left: cursor.x,
            top: cursor.y,
            // transition: "transform 120ms linear",
            // transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
          }}
        />);
      } else {return null;}
    })}
    </div>
  );
}

export default App;