import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Button} from "@mui/material";


export default function Landing(): React.ReactElement {
    return (
        <Container component="main">
            <Typography variant="h3">
                Welcome to Petitions365
            </Typography>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '30px',
            }}>
                <Button variant="contained" color="primary" href="/login">Login</Button>
                <Button variant="contained" color="primary" href="/register">Register</Button>
                <Button variant="contained" color="primary" href="/petitions">View Petitions</Button>
            </Box>
        </Container>
    );
}