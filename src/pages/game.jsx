import { useEffect, useState } from "react"
import "./game.css";
import { useParams } from "react-router-dom";

/* ================= BOARD ================= */

function Board({ playerPositions,onTileClick,houses }) {
  const tiles = [
    "GO","CE","T","MU","TAX","A1","DE","T","NYC","LA","JAIL",
    "CH","EC","LO","MS","A2","SY","T","MB","TAX","BE",
    "VAC","MN","T","KY","TK","A3","PS","WC","LY","GJ",
    "MA","TAX","TO","VC","A4","T","DU","TAX","AD"
  ];

  const colors = ["red", "blue", "green", "purple", "orange"]

  const grid = Array(121).fill(null);

  const positions = [
    110,111,112,113,114,115,116,117,118,119,120,
    109,98,87,76,65,54,43,32,21,10,
    9,8,7,6,5,4,3,2,1,0,
    11,22,33,44,55,66,77,88,99
  ];
  const gridToBoard = {}
  positions.forEach((gridIndex,boardIndex)=>{
    gridToBoard[gridIndex]=boardIndex
  })

  positions.forEach((pos, i) => {
    grid[pos] = tiles[i];
  });

  return (
    <div className="board">
      {grid.map((tile, i) => {
        const boardIndex = gridToBoard[i]
        const playersHere =  boardIndex!==undefined ? Object.entries(playerPositions)
          .filter(([id, pos]) => pos === boardIndex)
          :[]

        return (
          <div key={i} className={tile ? "tile" : "empty"} onClick={()=>{onTileClick(tile)}}>
            {tile}
            <div className="houses">
              {"🏠".repeat(houses[tile]||0)}
              </div>

            <div className="players">
              {playersHere.map(([id]) => (
                <div
                  key={id}
                  className="player-token"
                  
                  style={{ background: colors[id % colors.length] }}
                />
              ))}
            </div>

          </div>
        )
      })}
    </div>
  );
}

/* ================= APP ================= */

export default function Game()
{
  const [players,setPlayers]=useState([])
  const [currentName,setCurrentName]=useState("")
  const [game_id,setGameID]=useState(0)
  const [buyDecision,setBuyDecision]=useState(false)
  const [curretPlayerID,setCurrentPlayerID]=useState(0)
  const [lobbyID,setLobbyID]=useState(0)
  const [playerName,setPlayerName]=useState("")
  const [inLobby,setInLobby]=useState(false)
  
  

 let params=useParams();

  
  
  const [gameState,setGameState] = useState([])
  const [playerPositions,setPlayerPositions]=useState({})
  const [gameStarted, setGameStarted] = useState(true)
  const[selectedTile,setSelectedTile] = useState(null)
  const [houses,setHouses] = useState({})
  const [inJail,setInJail]=useState(false)
  const [tradeData,setTradeData]=useState({
    player1_id:0,
    player2_id:0,
    properties1:[],
    properties2:[],
    cash1:0,
    cash2:0,
    acceptance:true
  })
  const  [tradePlayer1,setTradePlayer1]=useState("")
  const [tradePlayer2,setTradePlayer2]=useState("")
  const [cash1,setCash1]=useState(0)
  const [cash2,setCash2]=useState(0)
  
  const selectedPlayer1 = gameState[tradePlayer1]
  const properties1=[
    ...(selectedPlayer1?.cities||[]),
    ...(selectedPlayer1?.airports||[]),
    ...(selectedPlayer1?.companies||[])
  ]

  const selectedPlayer2 = gameState[tradePlayer2]
  const properties2=[
    ...(selectedPlayer2?.cities||[]),
    ...(selectedPlayer2?.airports||[]),
    ...(selectedPlayer2?.companies||[])
  ]




  /*HANUMAN IS BEST*/

  const [diceValue,setDiceValue]=useState(0)
  const [currentNameG,setCurrentNameG]=useState(null)
  const [tradeMode,setTradeMode] = useState(false)
  const [log,setLog]=useState("")

  
  useEffect(()=>{
    fetch(`https://mp-backend-public-test.onrender.com/get_state/${params.gameId}`)
    .then(res=res.json)
    .then(data=>{
      console.log("Response",data)
      //setGameState(data.state)
    })
  })
  
  useEffect(()=>{
    console.log("updated player positions",playerPositions)
  },[playerPositions])
  useEffect(()=>{
    console.log("the selected tile is",selectedTile)
  },[selectedTile])
   useEffect(()=>{
    console.log("the game state is",gameState)
  },[gameState])
  useEffect(()=>{
    console.log("the selected player is",selectedPlayer1)
  },[selectedPlayer1])
  useEffect(()=>{
    console.log("the selected trade player is",tradePlayer1)
  },[tradePlayer1])
  useEffect(()=>{
    console.log("properties 1",properties1)
  },[properties1])
  
   useEffect(()=>{
    console.log("the selected properties",cash1)
  },[cash1])
   useEffect(()=>{
    setTradeData(prev=>({
      ...prev,
      cash1:Number(cash1)
    }))
   },[cash1])

   useEffect(()=>{
    setTradeData(prev=>({
      ...prev,
      cash2:Number(cash2)
    }))
   },[cash2])
   useEffect(()=>{
    setTradeData(prev=>({
      ...prev,
      player1_id:selectedPlayer1?.id
    }))
   },[selectedPlayer1])

   useEffect(()=>{
    setTradeData(prev=>({
      ...prev,
      player2_id:selectedPlayer2?.id
   }))},[selectedPlayer2])


   



  

  

  function rollDice(){
    fetch(`https://mp-backend-public-test.onrender.com/ /turn/${game_id}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
      console.log("data is",data)
      console.log("the no is",data.no)
      setBuyDecision(data.buy_decision)
      setInJail(data.in_jail)
      setCurrentPlayerID(data.player_id)
      setDiceValue(data.no)
      setCurrentNameG(data.name)
      setLog(data.log)

      const position = data.current_position

      // ✅ update ONLY that player
      setPlayerPositions(prev => ({
        ...prev,
        [data.player_id]: position
      }))
    })
    .catch(err=>console.error(err))
    fetch_state()
  }

  function jail_skip(){
    if (inJail===false){
      alert("You are not in jail hence do not press the button")
      return;
    }
    fetch(`https://mp-backend-public-test.onrender.com/ /jail_time_skip/${game_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        pay:false
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
    setInJail(false)})  
    .catch(err=>console.error(err))
  }

    function jail_pay(){
    if (inJail===false){
      alert("You are not in jail hence do not press the button")
      return;
    }
    fetch(`https://mp-backend-public-test.onrender.com/ /jail_time_pay/${game_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        pay:true
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
    setInJail(false)})  
    .catch(err=>console.error(err))
  }
 function trade(){
  fetch(`https://mp-backend-public-test.onrender.com/ /trade/${game_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(
    tradeData
        
      )
    })
    .then(res=>res.json())
    .then(()=>{
      console.log(tradeData)
      
    })
    .catch(err=>console.error(err))

 }
  function trade_decline(){
  fetch(`https://mp-backend-public-test.onrender.com/ /trade/${game_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
    ...tradeData,
    acceptance:false
        
  })
    })
    .then(res=>res.json())
    .then(()=>{
      console.log(tradeData)
      
    })
    .catch(err=>console.error(err))

 }
 

  function buy(){
    if (buyDecision===false){
      alert("you should not click the button")
      return;
    }

    fetch(`https://mp-backend-public-test.onrender.com/ /buy/${game_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        buy_decision:true
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response after buying a property",data)
      setBuyDecision(false)
      setLog(data)
      console.log("log",log)
    })
    .catch(err=>console.error(err))
  }

  function get_state(){
    fetch(`https://mp-backend-public-test.onrender.com/ /get_state/${game_id}`,{
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

  function toggleProperty(playerKey,property){
    setTradeData(prev =>{
      const current=prev[playerKey]
      const varib=current.includes(property)
      return{
        ...prev,
        [playerKey]: varib
        ? current.filter(p=>p!==property)
        :[...current,property]
      }
    })
  }
  function fetch_state(){
    fetch(`https://mp-backend-public-test.onrender.com/ /get_state/${game_id}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("Response:",data)
      setGameState(data)
    })
    .catch(err=>console.error(err))
  }

  
  function buy_house(){
    fetch(`https://mp-backend-public-test.onrender.com/ /get_house/${game_id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        city_id:selectedTile
      })
    })
    .then(res=>res.json())
    .then(data=>{
      setHouses(prev=>({
        ...prev,
        [selectedTile]:(prev[selectedTile]||0)+1
      }))
      console.log("Response",data)
      
    })
    .catch(err=>console.error(err))
  }


   return (
    <div className="app-container">
        <div>GAME

      {!gameStarted ? (
        <div className="card">
          <h2 id="title">Enter Players</h2>

         <div className="input-row">
            <input
              type="text"
              value={currentName}
              placeholder="Enter Player Name"
              onChange={(e)=>setCurrentName(e.target.value)}
            />
            <button onClick={AddPlayer}>Add</button>
          </div>

          <ul className="player-list">
            {players.map((p,i)=>(
              <li key={i}>{p}</li>
            ))}
          </ul>

          <button className="start-btn" onClick={sendPlayers}>
            START GAME
          </button>
        </div>

      ) : (

        <div className="card">
          <h2>Game Started 🎮</h2>

          <Board
            playerPositions={playerPositions}
            onTileClick={setSelectedTile}
            houses={houses}
          />
          <div className="board-center">
            {currentNameG} rolled {diceValue}

                {inJail && (<> <button onClick={jail_skip}>SKIP TURN</button>
          <button onClick={jail_pay}>PAY UP</button></>)}
          <div className="log">{log}</div>
            
            </div>
        

          <button onClick={rollDice}>ROLL DICE</button>
          <button onClick={buy}>BUY</button>
          <button onClick={get_state}>STATE</button>
          <button onClick={buy_house}>BUY HOUSE</button>
          
         
          <button onClick={()=>setTradeMode(true)}>TRADE HANUMAN</button>
         {tradeMode && (
          <div className="trade-mode">
             <select onChange={(e)=>setTradePlayer1(e.target.value)}>
            {players.map((p,i)=>(
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select onChange={(e)=>setTradePlayer2(e.target.value)}>
            {players.map((p,i)=>(
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="number"
            onChange={(e)=>setCash1(e.target.value)}
          />

          <input
            type="number"
            onChange={(e)=>setCash2(e.target.value)}
          />


            
          <div className="trade-section">
              <div>
                <h3>{tradePlayer1} Properties </h3>
                {properties1.map((property,ind)=>(
                <div key={ind}>
              <label>
            <input 
            type="checkbox" 
            checked={tradeData.properties1.includes(property)} 
            onChange={
              ()=> toggleProperty("properties1",property)}/>
              {property}
              </label>
              </div>
            ))}
            </div>

            <div>
                <h3>{tradePlayer2} Properties </h3>
                {properties2.map((property,ind)=>(
                <div key={ind}>
              <label>
            <input 
            type="checkbox" 
            checked={tradeData.properties2.includes(property)} 
            onChange={
              ()=> toggleProperty("properties2",property)}/>
              {property}
              </label>
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>{trade();
          setTradeMode(false)
        }}>TRADE</button>
        <button onClick={()=>{trade_decline();
          setTradeMode(false)
        }}>DECLINE TRADE</button>

            </div>



         )}           
         

          
          



        </div>
      )}
      </div>
    
  

    </div>
  );
}