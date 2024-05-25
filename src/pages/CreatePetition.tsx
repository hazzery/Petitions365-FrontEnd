import React from "react";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createPetition, getAllCategories, uploadPetitionImage} from "../model/api.ts";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {MenuItem, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";

import CreateSupportTier from "../components/CreateSupportTier.tsx";
import useFieldValidation from "../hooks/useFieldValidation.ts";
import SupportTierCard from "../components/SupportTierCard.tsx";
import UploadableImage from "../components/UploadableImage.tsx";
import NavBar from "../components/NavBar.tsx";
import {Category, PetitionCreation, SupportTier} from "../model/responseBodies.ts";
import {formatServerResponse} from "../model/util.ts";


const defaultTheme = createTheme();

export default function CreatePetition(): React.ReactElement {
    const navigate = useNavigate();

    const [title, setTitle] = useFieldValidation({required: true});
    const [description, setDescription] = useFieldValidation({required: true});
    const [category, setCategory] = React.useState<number | undefined>();

    const [petitionImage, setPetitionImage] = React.useState<File | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [supportTiers, setSupportTiers] = React.useState<Array<SupportTier>>([]);

    const [showSupportTierModal, setShowSupportTierModal] = React.useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isNaN(parseInt(localStorage.getItem('userId') || ''))) {
            navigate('/login');
        }
        getAllCategories()
            .then((response: AxiosResponse<Array<Category>>) => setCategories(response.data))
            .catch(() => null);
    }, [navigate]);

    function handleSubmit() {
        setFormSubmitted(true);

        if (petitionImage === null) {
            setErrorMessage("Please upload an image for your petition.");
            return;
        }

        if (title.error || description.error || category === undefined) {
            return;
        }

        createPetition(title.value, description.value, category, supportTiers)
            .then((response: AxiosResponse<PetitionCreation>) => {
                if (petitionImage !== null) {
                    uploadPetitionImage(response.data.petitionId, petitionImage)
                        .catch(() => {
                        });
                }
                navigate(`/petition/${response.data.petitionId}`);
            })
            .catch((error) => {
                setErrorMessage(error.response.statusText);
            });
    }

    function categoryOptions(): React.ReactElement[] {
        return categories.map((category: Category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.name}
            </MenuItem>
        ));
    }

    function addSupportTier(title: string, description: string, cost: number): void {
        if (title.length > 0 && description.length > 0 && cost >= 0) {
            setSupportTiers([...supportTiers, {title: title, description: description, cost: cost, supportTierId: 0}]);
            setShowSupportTierModal(false);
        }
    }

    function supportTierCards(): React.ReactElement[] {
        return supportTiers.map(
            (supportTier: SupportTier, index: number) => <Box key={index} sx={{display: "flex"}}>
                <SupportTierCard supportTier={supportTier}/>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setSupportTiers(supportTiers.filter((_, i) => i !== index))}
                    sx={{margin: 2}}
                >
                    <RemoveCircleIcon/>
                </Button>
            </Box>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main">
                <CssBaseline/>
                <Paper sx={{
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography component="h1" variant="h5">
                        New Petition
                    </Typography>
                    <Box sx={{marginTop: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <UploadableImage
                                        alt="Upload petition image here"
                                        setImage={setPetitionImage}
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            autoFocus
                                            label="Title"
                                            value={title.value}
                                            onChange={(event) => setTitle(event.target.value)}
                                            error={formSubmitted && Boolean(title.error)}
                                            helperText={formSubmitted && title.error}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            label="Description"
                                            value={description.value}
                                            onChange={(event) => setDescription(event.target.value)}
                                            error={formSubmitted && Boolean(description.error)}
                                            helperText={formSubmitted && description.error}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            required
                                            fullWidth
                                            label="Category"
                                            value={category}
                                            onChange={(event) => setCategory(parseInt(event.target.value))}
                                        >
                                            {categoryOptions()}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                {supportTierCards()}
                                {supportTiers.length < 3 && <Button
                                    fullWidth
                                    variant="contained"
                                    color={"secondary"}
                                    onClick={() => setShowSupportTierModal(true)}
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Add Support Tier
                                </Button>}
                            </Grid>
                        </Grid>
                        <CreateSupportTier
                            open={showSupportTierModal}
                            handleClose={() => setShowSupportTierModal(false)}
                            addSupportTier={addSupportTier}
                        />
                        <Typography variant="body1" color="error">
                            {errorMessage && formatServerResponse(errorMessage)}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{marginTop: 3, marginBottom: 2, width: '50%'}}
                            onClick={handleSubmit}
                        >
                            Create
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}