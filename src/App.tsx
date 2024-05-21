import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import CreatePetition from "./components/CreatePetition.tsx";
import EditPetition from "./components/EditPetition.tsx";
import MyPetitions from "./components/MyPetitions.tsx";
import UserProfile from "./components/UserProfile.tsx";
import EditProfile from "./components/EditProfile.tsx";
import Petitions from "./components/Petitions.tsx";
import Register from "./components/Register.tsx";
import Petition from "./components/Petition.tsx";
import NotFound from "./components/NotFound";
import Landing from "./components/Landing";
import Login from "./components/Login.tsx";
import './App.css';

export default function App() {

    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Landing/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/profile" element={<UserProfile/>}/>
                        <Route path="/edit-profile" element={<EditProfile/>}/>
                        <Route path="/petitions" element={<Petitions/>}/>
                        <Route path="/petition/:petitionId" element={<Petition/>}/>
                        <Route path="/petition/:petitionId/edit" element={<EditPetition/>}/>
                        <Route path="/petition/new" element={<CreatePetition/>}/>
                        <Route path="/my-petitions" element={<MyPetitions/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}
