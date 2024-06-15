import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";


export default function NotFound() {
    return (
        <Container component="main" maxWidth="xl">
            <Typography variant="h3">
                Oopsy daisy, that page can't be found!
            </Typography>
        </Container>
    );
}