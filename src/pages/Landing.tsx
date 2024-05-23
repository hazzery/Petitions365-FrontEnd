import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Button} from "@mui/material";


const defaultTheme = createTheme();

export default function Landing(): React.ReactElement {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Typography variant="h3">Welcome to Petitions365</Typography>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}>
                    <Button variant="contained" color="primary" href="/login">Login</Button>
                    <Button variant="contained" color="primary" href="/register">Register</Button>
                    <Button variant="contained" color="primary" href="/petitions">Petitions</Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}