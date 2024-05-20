import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";
import {Paper} from "@mui/material";

import PasswordInput from "./PasswordInput.tsx";
import NavBar from "./NavBar.tsx";
import {UserDetails, UserLogin} from "../model/responseBodies.ts";
import {getUser, login, register, updateUserDetails, uploadUserImage, userImageUrl} from "../model/api.ts";
import {formatServerResponse} from "../model/util.ts";



const defaultTheme = createTheme();

export default function EditProfile(): React.ReactElement {
    const navigate = useNavigate();
    const [userFirstName, setUserFirstName] = React.useState<string>("");
    const [userLastName, setUserLastName] = React.useState<string>("");
    const [userEmail, setUserEmail] = React.useState<string>("");
    const [userAvatarUrl, setUserAvatarUrl] = React.useState<string>("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [userImage, setUserImage] = React.useState<File | null>(null);

    const userId = parseInt(localStorage.getItem("userId") as string);

    React.useEffect(() => {
        getUser(userId)
            .then((response: AxiosResponse<UserDetails>) => {
                setUserFirstName(response.data.firstName);
                setUserLastName(response.data.lastName);
                setUserEmail(response.data.email);
                setUserAvatarUrl(userImageUrl(userId));
            })
            .catch(() => navigate("/login"));
    }, [navigate, userId]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        updateUserDetails(
            userId,
            data.get('email') as string,
            data.get('firstName') as string,
            data.get('lastName') as string,
            data.get('password') as string
        ).then(() => {
            navigate('/profile');
        }).catch((error) => {
            console.log(error.response);
            setErrorMessage(
                formatServerResponse(error.response.statusText)
            );
        });
    }

    // const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //     const files = event.target.files;
    //     if (files && files.length > 0) {
    //         setUserAvatar(files[0]);
    //         setUserAvatarUrl(URL.createObjectURL(files[0]));
    //     }
    // };

    // const handleAvatarUpload = (): void => {
    //     if (userAvatar) {
    //         setUserAvatarLoading(true);
    //         setUserAvatarSuccess
    //     }
    // }

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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput label="Current Password" name="currentPassword"/>
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput label="New Password" name="newPassword"/>
                            </Grid>
                        </Grid>
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}