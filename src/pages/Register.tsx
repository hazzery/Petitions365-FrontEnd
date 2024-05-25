import React, {ChangeEvent} from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";

import PasswordInput from "../components/PasswordInput.tsx";
import NavBar from "../components/NavBar.tsx";
import {login, register, uploadUserImage} from "../model/api.ts";
import {formatServerResponse} from "../model/util.ts";
import {UserLogin} from "../model/responseBodies.ts";


// The returned JSX has been modified from the Material-UI template at:
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-up/SignUp.tsx

const defaultTheme = createTheme();

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [userImage, setUserImage] = React.useState<File | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/petitions');
        }
    });

    function handleSubmit() {
        setFormSubmitted(true);
        register(email, firstName, lastName, password).then(() => {
            login(email, password)
                .then((response: AxiosResponse<UserLogin>) => {
                    const userId = response.data.userId;
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', String(userId));
                    if (userImage !== null) {
                        uploadUserImage(userId, userImage)
                            .catch(() => null);
                    }
                })
                .catch(() => null);
            navigate('/petitions');
        }).catch((error) => {
            setErrorMessage(
                formatServerResponse(error.response.statusText)
            );
        });
    }

    function handleAvatarClick() {
        inputRef.current?.click();
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setUserImage(event.target.files[0]);
            setUserImageUrl(URL.createObjectURL(event.target.files[0]));
        } else {
            setUserImage(null);
            setUserImageUrl(null);
        }
    }

    function firstNameError() {
        return formSubmitted && (
            firstName.length === 0 || firstName.length > 64
        );
    }

    function lastNameError() {
        return formSubmitted && (
            lastName.length === 0 || lastName.length > 64
        );
    }

    function emailError() {
        // email regex from https://stackoverflow.com/a/46181/12311071
        return formSubmitted && (
            email.length === 0 || email.length > 256
            || !email.toLowerCase().match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Avatar onClick={handleAvatarClick} sx={{
                        cursor: 'pointer',
                        marginTop: 2,
                        width: 100,
                        height: 100
                    }}>
                        <input
                            type="file"
                            ref={inputRef}
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                        {
                            userImageUrl ?
                                <img src={userImageUrl} alt="User"
                                     style={{objectFit: 'cover', width: '100%', height: '100%'}}/> :
                                <AccountCircleIcon sx={{fontSize: 120}} color="action"/>
                        }
                    </Avatar>
                    <Box sx={{marginTop: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    autoFocus
                                    label="First Name"
                                    autoComplete="given-name"
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    error={firstNameError()}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Last Name"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    error={lastNameError()}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    error={emailError()}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    required
                                    label="Password"
                                    value={password}
                                    onChange={(value) => setPassword(value)}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{marginTop: 3, marginBottom: 2}}
                            onClick={handleSubmit}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Link onClick={() => navigate("/login")} variant="body2">
                                    Already have an account? Log in
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={() => navigate("/")} variant="body2">
                                    Cancel
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
