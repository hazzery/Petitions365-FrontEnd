import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Register from "./components/Register.tsx";
import NotFound from "./components/NotFound";
import Landing from "./components/Landing";
import Login from "./components/Login.tsx";
import './App.css';
import Petitions from "./components/Petitions.tsx";
import Petition from "./components/Petition.tsx";

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
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    )
}

export default App;
