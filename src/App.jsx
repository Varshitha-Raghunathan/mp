import {Routes,Route} from 'react-router-dom'
import Home from "./pages/veedu.jsx"
import Lobby from "./pages/lobby.jsx"

export default function App(){
    return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path ="/lobby/:lobbyId" element={<Lobby />} />
        </Routes> );
        
}

