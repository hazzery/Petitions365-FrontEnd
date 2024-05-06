import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Register from "./components/Register.tsx";
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
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    )
}

export default App
