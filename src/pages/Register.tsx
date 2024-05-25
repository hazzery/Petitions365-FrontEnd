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
import {UserLogin} from "../model/responseBodies.ts";
import useFieldValidation from "../hooks/useFieldValidation.ts";


// The returned JSX has been modified from the Material-UI template at:
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-up/SignUp.tsx

const defaultTheme = createTheme();

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useFieldValidation({required: true, maxLength: 64});
    const [lastName, setLastName] = useFieldValidation({required: true, maxLength: 64});
    const [email, setEmail] = useFieldValidation({required: true, maxLength: 256, email: true});
    const [password, setPassword] = useFieldValidation({required: true, minLength: 6});

    const [userImage, setUserImage] = React.useState<File | null>(null);
    const [userImageUrl, setUserImageUrl] = React.useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/petitions');
        }
    });

    function handleSubmit() {
        setFormSubmitted(true);
        if (firstName.error || lastName.error || email.error || password.error) {
            return;
        }
        register(
            email.value, firstName.value, lastName.value, password.value
        ).then(() => {
            login(email.value, password.value)
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
        }).catch(() => setErrorMessage("Email address already in use"));
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
                                    value={firstName.value}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    error={formSubmitted && Boolean(firstName.error)}
                                    helperText={formSubmitted && firstName.error}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Last Name"
                                    autoComplete="family-name"
                                    value={lastName.value}
                                    onChange={(event) => setLastName(event.target.value)}
                                    error={formSubmitted && Boolean(lastName.error)}
                                    helperText={formSubmitted && lastName.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    autoComplete="email"
                                    value={email.value}
                                    onChange={(event) => setEmail(event.target.value)}
                                    error={formSubmitted && Boolean(email.error)}
                                    helperText={formSubmitted && email.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordInput
                                    required
                                    label="Password"
                                    value={password.value}
                                    onChange={(value) => setPassword(value)}
                                    error={formSubmitted && Boolean(password.error)}
                                    helperText={formSubmitted && password.error}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    errorMessage &&
                                    <Typography variant="body1" color="error" sx={{marginTop: 0}}>
                                        {errorMessage}
                                    </Typography>
                                }
                            </Grid>
                        </Grid>
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
