import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {AxiosResponse} from "axios";

import {UserDetails} from "../model/responseBodies.ts";
import {getUser, userImageUrl} from "../model/api.ts";
import NavBar from "./NavBar.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";


const defaultTheme = createTheme();

export default function UserProfile(): React.ReactElement {
    const navigate = useNavigate();
    const [userFirstName, setUserFirstName] = React.useState<string>("");
    const [userLastName, setUserLastName] = React.useState<string>("");
    const [userEmail, setUserEmail] = React.useState<string>("");

    const userId = parseInt(localStorage.getItem("userId") as string);
    React.useEffect(() => {
        getUser(userId)
            .then((response: AxiosResponse<UserDetails>) => {
                setUserFirstName(response.data.firstName);
                setUserLastName(response.data.lastName);
                setUserEmail(response.data.email);
            })
            .catch(() => navigate("/login"));
    }, [navigate, userId]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline/>
                <NavBar/>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <img src={userImageUrl(userId)} alt="Avatar" style={{width: "200px"}}/>
                    <Typography variant="h3">{userFirstName}</Typography>
                    <Typography variant="h3">{userLastName}</Typography>
                    <Typography variant="h3">{userEmail}</Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}