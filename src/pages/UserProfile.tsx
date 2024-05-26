import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";
import {Paper} from "@mui/material";

import NavBar from "../components/NavBar.tsx";
import {UserDetails} from "../model/responseBodies.ts";
import {getUser, userImageUrl} from "../model/api.ts";


const defaultTheme = createTheme();

export default function UserProfile(): React.ReactElement {
    const navigate = useNavigate();
    const [userFirstName, setUserFirstName] = React.useState<string>("");
    const [userLastName, setUserLastName] = React.useState<string>("");
    const [userEmail, setUserEmail] = React.useState<string>("");
    const [userHasImage, setUserHasImage] = React.useState<boolean>(true);

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
            <NavBar/>
            <Container component="main">
                <CssBaseline/>
                <Paper sx={{
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar sx={{
                        marginTop: 2,
                        width: 100,
                        height: 100
                    }}>
                        {
                            userHasImage
                                ? <img
                                    src={userImageUrl(userId)}
                                    alt="User profile avatar"
                                    onError={() => setUserHasImage(false)}
                                    style={{objectFit: 'cover', width: '100%', height: '100%'}}
                                />
                                : <AccountCircleIcon sx={{fontSize: 120}} color="action"/>
                        }
                    </Avatar>
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