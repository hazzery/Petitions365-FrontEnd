import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";

import NavBar from "../components/NavBar.tsx";
import {UserLogin} from "../model/responseBodies.ts";
import {login} from "../model/api.ts";


// The majority of this code was taken from the Material-UI example at
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

const defaultTheme = createTheme();

export default function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/petitions');
        }
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        login(data.get('email') as string, data.get('password') as string)
            .then((response: AxiosResponse<UserLogin>) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', String(response.data.userId));
                navigate('/petitions');
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
                setErrorMessage("Invalid email or password");
            });
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Log In
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Link onClick={() => navigate("/register")} variant="body2">
                                    {"Don't have an account? Register"}
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