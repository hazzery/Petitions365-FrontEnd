import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GroupIcon from "@mui/icons-material/Group";
import Typography from "@mui/material/Typography";
import PaidIcon from "@mui/icons-material/Paid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {Card, CardMedia, Paper} from "@mui/material";
import {AxiosResponse} from "axios";

import SupportTierCard from "../components/SupportTierCard.tsx";
import SelectTierModal from "../components/SelectTierModal.tsx";
import SupportersGrid from "../components/SupportersGrid.tsx";
import PetitionsGrid from "../components/PetitionsGrid.tsx";
import BoxModal from "../components/BoxModal.tsx";
import NavBar from "../components/NavBar.tsx";
import {
    deletePetition,
    getAllCategories,
    getFilteredPetitions,
    getPetitionDetails,
    getSupportersOfPetition,
    petitionImageUrl,
    userImageUrl
} from "../model/api.ts";
import {
    Category,
    PetitionDetails,
    PetitionOverview,
    PetitionsList,
    Supporter,
    SupportTier
} from "../model/responseBodies.ts";
import {formatDate} from "../model/util.ts";


const defaultTheme = createTheme();

export default function Petition() {
    const {petitionId} = useParams();
    const [petitionIdNumber, setPetitionIdNumber] = React.useState<number>(parseInt(petitionId as string));
    const navigate = useNavigate();
    const [petitionDetails, setPetitionDetails] = React.useState<PetitionDetails | undefined>();
    const [supporters, setSupporters] = React.useState<Array<Supporter>>([]);
    const [similarPetitions, setSimilarPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map());
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showSupportModal, setShowSupportModal] = React.useState(false);
    const [shouldReFetch, setShouldReFetch] = React.useState(false);

    React.useEffect(() => {
        setPetitionIdNumber(parseInt(petitionId as string));
    }, [petitionId]);

    React.useEffect(() => {
        if (isNaN(petitionIdNumber)) {
            navigate("/not-found");
        }
    }, [petitionIdNumber, navigate]);

    React.useEffect(() => {
        getPetitionDetails(petitionIdNumber)
            .then((response: AxiosResponse<PetitionDetails>) => setPetitionDetails(response.data))
            .catch(() => null);
        window.scrollTo(0, 0);
    }, [petitionIdNumber, shouldReFetch]);

    React.useEffect(() => {
        getSupportersOfPetition(petitionIdNumber)
            .then((response: AxiosResponse<Array<Supporter>>) => setSupporters(response.data))
            .catch(() => null);
    }, [petitionIdNumber, shouldReFetch]);

    React.useEffect(() => {
        function mergePetitionListPromises(
            setState: React.Dispatch<React.SetStateAction<Array<PetitionOverview>>>,
            ...promises: Array<Promise<AxiosResponse<PetitionsList>>>
        ): void {
            const similarPetitionMap: Map<number, PetitionOverview> = new Map();
            Promise.all(promises)
                .then((responses: AxiosResponse<PetitionsList>[]) => {
                    responses.forEach((response: AxiosResponse<PetitionsList>) => {
                        for (const petition of response.data.petitions) {
                            if (petition.petitionId !== petitionIdNumber) {
                                similarPetitionMap.set(petition.petitionId, petition);
                            }
                        }
                    });
                    setState(Array.from(similarPetitionMap.values()));
                })
                .catch(() => null);
        }

        if (petitionDetails === undefined) {
            return;
        }

        mergePetitionListPromises(
            setSimilarPetitions,
            getFilteredPetitions({categoryIds: [petitionDetails.categoryId]}),
            getFilteredPetitions({ownerId: petitionDetails.ownerId})
        );
    }, [petitionDetails, petitionIdNumber]);

    React.useEffect(() => {
        getAllCategories()
            .then((response: AxiosResponse<Array<Category>>) => {
                const map = new Map<number, string>();
                response.data.forEach((category: Category) => {
                    map.set(category.categoryId, category.name);
                });
                setCategoryMap(map);
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.statusText);
            });

    }, []);

    function supportTierCards(): React.ReactElement[] {
        if (petitionDetails === undefined) {
            return [];
        }
        return petitionDetails.supportTiers.map(
            (supportTier: SupportTier, index: number) => <SupportTierCard
                key={index}
                supportTier={supportTier}
            />
        );
    }

    function removePetition(): void {
        deletePetition(petitionIdNumber)
            .then(() => navigate("/petitions"))
            .catch(() => null);
    }

    function ownerActionButtons(): React.ReactElement {
        return (
            <>
                <Button variant="contained" color="primary"
                        onClick={() => navigate("edit")}>
                    Edit Petition
                </Button>
                {
                    !petitionDetails?.numberOfSupporters &&
                    <Button variant="contained" color="error"
                            onClick={() => setShowDeleteModal(true)}>
                        Delete Petition
                    </Button>
                }
                <BoxModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Are you sure you want to delete this petition?
                        </Typography>
                        <Button variant="contained" color="error" onClick={removePetition}>Delete</Button>
                        <Button variant="contained" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                </BoxModal>
            </>
        );
    }

    function unauthenticatedUserActionButtons(): React.ReactElement {
        return (
            <>
                <Typography variant="body1" component="div">
                    You must have an account to support this petition
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
                    Login
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate("/register")}>
                    Register
                </Button>
            </>
        );
    }

    function supporterActionButtons(): React.ReactElement {
        if (petitionDetails === undefined) {
            return <></>;
        }
        return (
            <>
                <Button variant="contained" color="primary" onClick={() => setShowSupportModal(true)}>
                    Support this petition
                </Button>
                <SelectTierModal
                    open={showSupportModal}
                    onClose={() => setShowSupportModal(false)}
                    supporters={supporters}
                    supportTiers={petitionDetails.supportTiers}
                    petitionId={Number(petitionId)}
                    causeReFetch={() => setShouldReFetch(!shouldReFetch)}
                />
            </>
        );
    }

    if (petitionDetails === undefined) {
        return <>
            <ThemeProvider theme={defaultTheme}>
                <NavBar/>
                <Container component="main">
                    <CssBaseline/>
                </Container>
            </ThemeProvider>
        </>;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar/>
            <Container component="main">
                <CssBaseline/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h2" component="div">
                        {petitionDetails.title}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
                            <Paper sx={{padding: 2, flex: 1}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={8} sx={{display: 'flex', justifyContent: 'center'}}>
                                        <CardMedia
                                            component="img"
                                            image={petitionImageUrl(petitionIdNumber)}
                                            alt="petition"
                                            sx={{
                                                width: '80%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Avatar
                                            src={userImageUrl(petitionDetails.ownerId)}
                                            alt="User profile image"
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Typography variant="body2" color="text.primary" sx={{ml: 1}}>
                                            {`${petitionDetails.ownerFirstName} ${petitionDetails.ownerLastName}`}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {formatDate(petitionDetails.creationDate)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="body1" component="div">
                                    {petitionDetails.description}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
                            <Paper sx={{padding: 2, flex: 1}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-evenly', marginBottom: '15px'}}>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <GroupIcon/>
                                        <Typography variant="body1" sx={{marginLeft: 1}}>
                                            {`Supporters: ${petitionDetails.numberOfSupporters}`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <PaidIcon/>
                                        <Typography variant="body1" sx={{marginLeft: 1}}>
                                            {`Money Raised: ${petitionDetails.moneyRaised !== null ? petitionDetails.moneyRaised : 0}`}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h5" component="div">
                                    Support Tiers
                                </Typography>
                                <Box sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    {supportTierCards()}
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Card sx={{
                                padding: 2,
                                display: "flex",
                                columnGap: "20px",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}>
                                {
                                    petitionDetails.ownerId === parseInt(localStorage.getItem("userId") as string)
                                        ? <>{ownerActionButtons()}</>
                                        : localStorage.getItem("userId") === null
                                            ? <>{unauthenticatedUserActionButtons()}</>
                                            : <>{supporterActionButtons()}</>
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <SupportersGrid supporters={supporters} supportTiers={petitionDetails.supportTiers}/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <PetitionsGrid
                                petitions={similarPetitions}
                                categoryMap={categoryMap}
                                title={
                                    <Typography variant="h6" component="div" sx={{marginTop: '15px'}}>
                                        Similar Petitions
                                    </Typography>
                                }
                                children={undefined}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
