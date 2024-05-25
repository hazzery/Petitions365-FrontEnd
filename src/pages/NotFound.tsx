import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import NavBar from "../components/NavBar.tsx";


const defaultTheme = createTheme();

export default function NotFound() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main" maxWidth="xl">
                <CssBaseline/>
                <Typography variant="h3">
                    Oopsy daisy, that page can't be found!
                </Typography>
            </Container>
        </ThemeProvider>
    );
}