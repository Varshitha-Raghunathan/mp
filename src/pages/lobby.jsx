import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Lobby(){
    const [playerName,setPlayerName]=useState("")
    const [joined,setJoined]=useState(false)
    const [playersInLobby,setPlayersInLobby]=useState([])
    let params= useParams();

    useEffect(()=>{
        const  name=localStorage.getItem(`lobby_${params.lobbyId}_player`)
        if (name){
            setPlayerName(name)
            setJoined(true)
            
        }
    },[])
    
    
    function join_lobby(){
        localStorage.setItem(`lobby_${params.lobbyId}_player`,"anna")
        fetch(`https://mp-backend-public-test.onrender.com/join_lobby/${params.lobbyId}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        player_name:playerName
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
    
setJoined(true);
get_lobby();})  
    .catch(err=>console.error(err))
    }

    function get_lobby(){
      fetch(`https://mp-backend-public-test.onrender.com/get_lobbies/${params.lobbyId}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
     
      
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
      setPlayersInLobby(data.players)
    
})  
    .catch(err=>console.error(err))

    }
    function start_game(){
      fetch(`https://mp-backend-public-test.onrender.com/start_game/${params.lobbyId}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
       body:JSON.stringify({
        players:playersInLobby
      })
      
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
    
      setPlayersInLobby(data.players)})  
    .catch(err=>console.error(err))


    }
    return (<div>
        
        {!joined ?(
            <div>
            <input
              type="text"
              value={playerName}
              placeholder="Enter Player Name"
              onChange={(e)=>setPlayerName(e.target.value)
                
              }
            />
             <button onClick={join_lobby}>Join Lobby</button>
            
            </div>
        ) :
        (<div><h1> HANUMAN LOBBY {params.lobbyId}</h1>
          {playersInLobby.map((element,ind)=>(
            <h3 key={ind}> {element} </h3>
          ))
        }
        <button onClick={start_game}>START GAME</button>
        </div>
        )
        }
       
        <h1>LOBBY {params.lobbyId}</h1> </div>);
}

