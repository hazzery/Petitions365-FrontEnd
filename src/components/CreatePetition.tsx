import React, {ChangeEvent} from "react";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CardMedia} from "@mui/material";
import {createPetition, uploadPetitionImage} from "../model/api.ts";
import {AxiosResponse} from "axios";
import {PetitionCreation} from "../model/responseBodies.ts";


const defaultTheme = createTheme();

export default function CreatePetition(): React.ReactElement {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [petitionImage, setPetitionImage] = React.useState<File | null>(null);
    const [petitionImageUrl, setPetitionImageUrl] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    function handleImageUpload() {
        inputRef.current?.click();
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setPetitionImage(event.target.files[0]);
            setPetitionImageUrl(URL.createObjectURL(event.target.files[0]));
        } else {
            setPetitionImage(null);
            setPetitionImageUrl(null);
        }
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        createPetition(
            data.get('title') as string,
            data.get('description') as string,
            1,
            []
        )
            .then((response: AxiosResponse<PetitionCreation>) => {
                if (petitionImage !== null) {
                    uploadPetitionImage(response.data.petitionId, petitionImage);
                }
            })
            .catch((error) => {
                setErrorMessage(error.response.statusText);
            });
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
                        New Petition
                    </Typography>
                    <CardMedia
                        component='div'
                        onClick={handleImageUpload}
                        sx={{
                            cursor: 'pointer',
                            marginTop: 2,
                            maxWidth: "300px",
                            maxHeight: "300px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {
                            petitionImageUrl ?
                                <img src={petitionImageUrl} alt="User"
                                     style={{objectFit: 'cover', width: '100%', height: '100%'}}/> :
                                <AddPhotoAlternateIcon sx={{fontSize: 50}} color="action"/>
                        }
                    </CardMedia>
                    <input
                        type="file"
                        ref={inputRef}
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                    />
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="petitionTitle"
                                    required
                                    fullWidth
                                    id="petitionTitle"
                                    label="Title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="petitionDescription"
                                    label="Description"
                                    name="petitionDescription"
                                />
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
                            Create
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}