import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import CreatePetition from "./pages/CreatePetition.tsx";
import EditPetition from "./pages/EditPetition.tsx";
import MyPetitions from "./pages/MyPetitions.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import Petitions from "./pages/Petitions.tsx";
import Register from "./pages/Register.tsx";
import Petition from "./pages/Petition.tsx";
import NotFound from "./pages/NotFound.tsx";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
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
