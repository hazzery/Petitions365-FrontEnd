import React, {ChangeEvent} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {MenuItem, Paper} from "@mui/material";
import {AxiosResponse} from "axios";

import UploadableImage from "../components/UploadableImage.tsx";
import NavBar from "../components/NavBar.tsx";
import {
    editPetition,
    getAllCategories,
    getPetitionDetails,
    petitionImageUrl,
    uploadPetitionImage
} from "../model/api.ts";
import {Category, PetitionDetails, SupportTier} from "../model/responseBodies.ts";
import {formatServerResponse} from "../model/util.ts";
import Box from "@mui/material/Box";
import SupportTiersPaper from "../components/SupportTiersPaper.tsx";


const defaultTheme = createTheme();

export default function EditPetition(): React.ReactElement {
    const {petitionId} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [categoryId, setCategoryId] = React.useState<number>(NaN);
    const [image, setImage] = React.useState<File | null>(null);
    const [supportTiers, setSupportTiers] = React.useState<Array<SupportTier>>([]);

    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [categories, setCategories] = React.useState<Array<Category>>([]);

    React.useEffect(() => {
        const petitionIdNumber = parseInt(petitionId as string);
        getPetitionDetails(petitionIdNumber)
            .then((response: AxiosResponse<PetitionDetails>) => {
                setTitle(response.data.title);
                setDescription(response.data.description);
                setCategoryId(response.data.categoryId);
                setSupportTiers(response.data.supportTiers);
            })
            .catch(() => null);

        getAllCategories()
            .then((response: AxiosResponse<Array<Category>>) => setCategories(response.data))
            .catch(() => null);
    }, [petitionId]);

    function categoryOptions(): React.ReactElement[] {
        return categories.map((category: Category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.name}
            </MenuItem>
        ));
    }

    function handleSavePetition(): void {
        editPetition(Number(petitionId), title, description, categoryId)
            .then(() => {
                if (image) {
                    uploadPetitionImage(Number(petitionId), image)
                        .catch(() => null);
                }
                navigate("/petition/" + petitionId);
            })
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main" maxWidth="lg">
                <CssBaseline/>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    alignItems: 'center',
                }}>
                    <Paper sx={{padding: "40px"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4">Edit Petition</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <UploadableImage
                                    imageUrl={petitionImageUrl(Number(petitionId))}
                                    alt="Petition Image"
                                    setImage={setImage}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    name="petitionTitle"
                                    label="Title"
                                    value={title}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    name="petitionDescription"
                                    label="Description"
                                    value={description}
                                    onChange={
                                        (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    name="category"
                                    label="Category"
                                    value={!isNaN(categoryId) ? categoryId : ""}
                                    onChange={
                                        (event: ChangeEvent<HTMLInputElement>) => setCategoryId(parseInt(event.target.value))
                                    }
                                >
                                    {categoryOptions()}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="error">{errorMessage}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={handleSavePetition}>
                                    <Typography variant="button">Save</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <SupportTiersPaper
                        supportTiers={supportTiers}
                        petitionId={petitionId as string}
                    />
                    <Button variant="contained" onClick={() => navigate("/petition/" + petitionId)}>
                        <Typography variant="button">
                            Cancel
                        </Typography>
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
