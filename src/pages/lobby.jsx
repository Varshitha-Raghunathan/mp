import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Lobby(){
  let navigate=useNavigate()
 // throw Error("lobby sucks")
  console.log("lobby componenet is being rendered")
    const [playerName,setPlayerName]=useState("")
    const [joined,setJoined]=useState(false)
    const [playersInLobby,setPlayersInLobby]=useState([])
    const [gameId,setGameId]=useState(0)
    let params= useParams();
    useEffect(()=>{
      console.log("players in lobby after updation",playersInLobby)
    },[playersInLobby]);

    useEffect(()=>{
      console.log("first use effect")
        const  name=localStorage.getItem(`lobby_${params.lobbyId}_player`)
        if (name){
            setPlayerName(name)
            setJoined(true)
            console.log(localStorage.getItem("name has been set",`lobby_${params.lobbyId}_player`))
            
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

    useEffect(()=>{
      const interval= setInterval(()=>{
        console.log("am being called lobby status")
        fetch(`https://mp-backend-public-test.onrender.com/lobby_status/${params.lobbyId}`)
        .then(res=>res.json())
        .then(data=>{
          if(data.started){
            console.log("game id is",data.game_id)
            fetch(`https://mp-backend-public-test.onrender.com/get_state/${data.game_id}`)
            .then(res=>res.json())
            .then(stateData=>{
              console.log("I GO IN",playerName)
              const players=Object.values(stateData)
              const myPlayer = players.find(
             player => player.name === playerName
              );
            if (myPlayer){
            localStorage.setItem("our_player_id",myPlayer.id)
            console.log("am making this long so i can notice thisStored player id",myPlayer.id)}
            

            })
            console.log("is there a player id stored",localStorage.getItem("our_player_id"))
            console.log("NAVIGATING")
            navigate(`/game/${data.game_id}`)
            
            
            //setGameId(data.game_id)
          }
        })
      },1000);
      return ()=>clearInterval(interval)

    },[]);
    
    
    function join_lobby(){
        localStorage.setItem(`lobby_${params.lobbyId}_player`,playerName)
        console.log(
  "Stored lobby player:",
  localStorage.getItem(`lobby_${params.lobbyId}_player`)
);
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
    localStorage.setItem("our_player",playerName)
    console.log("this browser's player",localStorage.getItem("our_player"))
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
      const myName=localStorage.getItem(`lobby_${params.lobbyId}_player`)
      const myPlayer = data.STATE.find(
        player => player.name === myName
      );
      if (myPlayer)
      localStorage.setItem("our_player_id",myPlayer.id)
    console.log("Stored player id",myPlayer.id)
      navigate(`/game/${data.game_id}`)
      setGameId(data.game_id)
    
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
