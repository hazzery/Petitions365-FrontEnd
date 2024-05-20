import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import CreatePetition from "./components/CreatePetition.tsx";
import MyPetitions from "./components/MyPetitions.tsx";
import Petitions from "./components/Petitions.tsx";
import Register from "./components/Register.tsx";
import Petition from "./components/Petition.tsx";
import NotFound from "./components/NotFound";
import Landing from "./components/Landing";
import Login from "./components/Login.tsx";
import './App.css';

function App() {

    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Landing/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/petitions" element={<Petitions/>}/>
                        <Route path="/petition/:petitionId" element={<Petition/>}/>
                        <Route path="/petition/new" element={<CreatePetition/>}/>
                        <Route path="/my-petitions" element={<MyPetitions/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
