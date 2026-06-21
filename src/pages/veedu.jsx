import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Home(){
const [inLobby,setInLobby]=useState(false)
const [lobbyID,setLobbyID]=useState(0)
let navigate=useNavigate()
function createLobby(){
  fetch("https://mp-backend-public-test.onrender.com/create_lobbies",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
      
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
      setLobbyID(data.lobby_id)
      setInLobby(true)
      navigate(`/lobby/${data.lobby_id}`)

      //setGameStarted(true)

      // ✅ Initialize positions using GLOBAL player IDs
     
    })
    .catch(err=>console.error(err))
  }



    return (<div className="lobby">
          return <h1>HANUMAN</h1>
          <button onClick={createLobby}>CREATE LOBBY</button>
        </div>)
   ;
}