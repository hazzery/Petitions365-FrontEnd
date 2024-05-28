import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";

import useStringValidation from "../hooks/useStringValidation.ts";
import PasswordInput from "../components/PasswordInput.tsx";
import {UserLogin} from "../model/responseBodies.ts";
import {login} from "../model/api.ts";


// The majority of this code was taken from the Material-UI example at
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useStringValidation({required: true, email: true, maxLength: 256});
    const [password, setPassword] = useStringValidation({required: true, minLength: 6, maxLength: 64});
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>();
    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/petitions');
        }
    }, [navigate]);

    function handleSubmit() {
        setFormSubmitted(true);
        if (email.error || password.error) {
            return;
        }
        login(email.value, password.value)
            .then((response: AxiosResponse<UserLogin>) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', String(response.data.userId));
                navigate('/petitions');
            })
            .catch(() => setErrorMessage("Incorrect email or password"));
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{margin: 1, backgroundColor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        required
                        fullWidth
                        autoFocus
                        margin="normal"
                        label="Email Address"
                        autoComplete="email"
                        value={email.value}
                        onChange={(event) => setEmail(event.target.value)}
                        error={formSubmitted && Boolean(email.error)}
                        helperText={formSubmitted && email.error}
                    />
                    <PasswordInput
                        required
                        label="Password"
                        value={password.value}
                        onChange={(value) => setPassword(value)}
                        error={formSubmitted && Boolean(password.error)}
                        helperText={formSubmitted && password.error}
                    />
                    {
                        errorMessage &&
                        <Typography variant="body1" color="error" sx={{marginTop: "15px"}}>
                            {errorMessage}
                        </Typography>
                    }
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{marginTop: 3, marginBottom: 2}}
                        onClick={handleSubmit}
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
    );
}