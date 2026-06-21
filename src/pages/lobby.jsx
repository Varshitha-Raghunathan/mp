import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Lobby(){
 // throw Error("lobby sucks")
  console.log("lobby componenet is being rendered")
    const [playerName,setPlayerName]=useState("")
    const [joined,setJoined]=useState(false)
    const [playersInLobby,setPlayersInLobby]=useState([])
    let params= useParams();

    useEffect(()=>{
      console.log("first use effect")
        const  name=localStorage.getItem(`lobby_${params.lobbyId}_player`)
        if (name){
            setPlayerName(name)
            setJoined(true)
            
        }
        console.log(name)
        console.log(joined)
    },[])

    useEffect(()=>{
      if (!joined) {console.log("am not true");return ;}
      console.log("am being called")
      get_lobby();
      const interval=setInterval(()=>{
        get_lobby();
      },2000);
      return () => clearInterval(interval)
    },[joined]);
    
    
    function join_lobby(){
        localStorage.setItem(`lobby_${params.lobbyId}_player`,playerName)
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
})  
    .catch(err=>console.error(err))
    }

    function get_lobby(){
      console.log("get_lobby is being called")
      fetch(`https://mp-backend-public-test.onrender.com/get_lobbies/${params.lobbyId}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
     
      
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
      console.log("players in lobby before",playersInLobby)
      setPlayersInLobby(data.players)
      console.log("players in lobby after",playersInLobby)
    
})  
    .catch(err=>console.error(err))

    }
    function start_game(){
      fetch(`https://mp-backend-public-test.onrender.com/start_game/${params.lobbyId}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
      
      
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
    
      })  
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

