import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from '@mui/material/styles';

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
import NavBar from "./components/NavBar.tsx";

export default function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <NavBar/>
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
        </ThemeProvider>
    );
}
