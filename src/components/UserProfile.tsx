import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {Paper} from "@mui/material";
import {AxiosResponse} from "axios";

import NavBar from "./NavBar.tsx";
import {UserDetails} from "../model/responseBodies.ts";
import {getUser, userImageUrl} from "../model/api.ts";


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
                <Paper sx={{
                    marginTop: 5,
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <img
                        src={userImageUrl(userId)}
                        alt="User profile avatar"
                        style={{width: "200px", borderRadius: "50%"}}
                    />
                    <Typography variant="h3">
                        {userFirstName + ' ' + userLastName}
                    </Typography>
                    <Typography variant="h6">
                        {userEmail}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/edit-profile")}
                        style={{marginTop: "30px"}}
                    >
                        Edit profile
                    </Button>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}