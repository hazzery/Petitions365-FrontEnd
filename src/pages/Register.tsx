import * as React from 'react';
import {ChangeEvent} from 'react';
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

import {UserLogin} from "../model/responseBodies.ts";
import {login, register, uploadUserImage} from "../model/api.ts";
import {formatServerResponse} from "../model/util.ts";
import PasswordInput from "../components/PasswordInput.tsx";


// The returned JSX is copied from the Material-UI template at:
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-up/SignUp.tsx

const defaultTheme = createTheme();

export default function Register() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [userImage, setUserImage] = React.useState<File | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/petitions');
        }
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        register(
            email,
            data.get('firstName') as string,
            data.get('lastName') as string,
            password
        ).then(() => {
            login(email, password)
                .then((response: AxiosResponse<UserLogin>) => {
                    const userId = response.data.userId;
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', String(userId));
                    if (userImage !== null) {
                        uploadUserImage(userId, userImage)
                            .catch(() => {});
                    }
                })
                .catch((error) => {
                    console.log(error.response);
                });
            navigate('/petitions');
        }).catch((error) => {
            console.log(error.response);
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

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
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
                                <PasswordInput required label="Password" name="password"/>
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
