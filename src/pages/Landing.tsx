import {Button} from "@mui/material";
// type LandingProps = Record<string, never>;


export default function Landing() {
    return (
        <div>
            <h1>Welcome to SENG365 Petition Site</h1>
            <Button variant="contained" color="primary" href="/login">Login</Button>
            <Button variant="contained" color="primary" href="/register">Register</Button>
            <Button variant="contained" color="primary" href="/petitions">Petitions</Button>
        </div>
    );
}