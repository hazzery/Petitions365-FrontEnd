import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import GroupIcon from "@mui/icons-material/Group";
import Typography from "@mui/material/Typography";
import PaidIcon from "@mui/icons-material/Paid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Card, CardMedia, Paper} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {AxiosResponse} from "axios";

import {
    deletePetition,
    getAllCategories,
    getFilteredPetitions,
    getPetitionDetails,
    getSupportersOfPetition,
    petitionImageUrl,
    supportPetition,
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
import SupportTierCard from "../components/SupportTierCard.tsx";
import PetitionsGrid from "../components/PetitionsGrid.tsx";
import NavBar from "../components/NavBar.tsx";
import {formatDate} from "../model/util.ts";
import SupportersGrid from "../components/SupportersGrid.tsx";


const defaultTheme = createTheme();

export default function Petition() {
    const {petitionId} = useParams();
    const [petitionIdNumber] = React.useState<number>(parseInt(petitionId as string));
    const navigate = useNavigate();
    const [creationDate, setCreationDate] = React.useState<string>("");
    const [imageURL, setImageURL] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [categoryId, setCategoryId] = React.useState<number>(NaN);
    const [ownerId, setOwnerId] = React.useState<number>(NaN);
    const [ownerImageUrl, setOwnerImageUrl] = React.useState<string>("");
    const [ownerFirstName, setOwnerFirstName] = React.useState<string>("");
    const [ownerLastName, setOwnerLastName] = React.useState<string>("");
    const [numberOfSupporters, setNumberOfSupporters] = React.useState<number>(NaN);
    const [moneyRaised, setMoneyRaised] = React.useState<number>(NaN);
    const [supportTiers, setSupportTiers] = React.useState<Array<SupportTier>>([]);
    const [supporters, setSupporters] = React.useState<Array<Supporter>>([]);
    const [similarPetitions, setSimilarPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map());
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showSupportModal, setShowSupportModal] = React.useState(false);

    // if (isNaN(petitionIdNumber)) {
    //     return <NotFound/>;
    // }
    React.useEffect(() => {
        getPetitionDetails(petitionIdNumber)
            .then((response: AxiosResponse<PetitionDetails>) => {
                setCreationDate(response.data.creationDate);
                setImageURL(petitionImageUrl(petitionIdNumber));
                setTitle(response.data.title);
                setDescription(response.data.description);
                setCategoryId(response.data.categoryId);
                setOwnerId(response.data.ownerId);
                setOwnerImageUrl(userImageUrl(response.data.ownerId));
                setOwnerFirstName(response.data.ownerFirstName);
                setOwnerLastName(response.data.ownerLastName);
                setNumberOfSupporters(response.data.numberOfSupporters);
                setMoneyRaised(response.data.moneyRaised);
                setSupportTiers(response.data.supportTiers);
            })
            .catch((error) => {
                setTitle(error.response.status.toString());
                setDescription(error.response.statusText);
            });
    }, [petitionIdNumber]);

    React.useEffect(() => {
        getSupportersOfPetition(petitionIdNumber)
            .then((response: AxiosResponse<Array<Supporter>>) => {
                setSupporters(response.data);
            })
            .catch((error) => {
                setTitle(error.response.status.toString());
                setDescription(error.response.statusText);
            });
    }, [petitionIdNumber]);

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
                .catch((error) => {
                    setTitle(error.response.status.toString());
                    setDescription(error.response.statusText);
                });
        }

        if (!isNaN(categoryId) && !isNaN(ownerId)) {
            mergePetitionListPromises(
                setSimilarPetitions,
                getFilteredPetitions({categoryIds: [categoryId]}),
                getFilteredPetitions({ownerId: ownerId})
            );
        }
    }, [categoryId, ownerId, petitionIdNumber]);

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

    function supportSupportTier(supportTierId: number): void {
        supportPetition(Number(petitionId), supportTierId)
            .then(() => setShowSupportModal(false))
            .catch(() => null);
    }

    function supportTierCards(): React.ReactElement[] {
        return supportTiers.map(
            (supportTier: SupportTier, index: number) => <SupportTierCard
                key={index}
                supportTier={supportTier}
            />
        );
    }

    function supportableTierCards(): React.ReactElement[] {
        const supportedTiers = supporters.filter(
            (supporter: Supporter) => supporter.supporterId === parseInt(localStorage.getItem("userId") as string)
        ).map((supporter: Supporter) => supporter.supportTierId);

        const supportableTiers = supportTiers.filter(
            (supportTier: SupportTier) => !supportedTiers.includes(supportTier.supportTierId)
        );

        return supportableTiers.map(
            (supportTier: SupportTier, index: number) => <SupportTierCard
                key={index}
                supportTier={supportTier}
                onClick={() => supportSupportTier(supportTier.supportTierId)}
            />
        );
    }

    function removePetition(): void {
        deletePetition(Number(petitionId))
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
                    numberOfSupporters === 0 &&
                    <Button variant="contained" color="error"
                            onClick={() => setShowDeleteModal(true)}>
                        Delete Petition
                    </Button>
                }
                <Modal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    aria-labelledby="modal-modal-title"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        borderRadius: '20px',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Are you sure you want to delete this petition?
                        </Typography>
                        <Button variant="contained" color="error" onClick={removePetition}>Delete</Button>
                        <Button variant="contained" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    </Box>
                </Modal>
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
        return (
            <>
                <Button variant="contained" color="primary" onClick={() => setShowSupportModal(true)}>
                    Support this petition
                </Button>
                <Modal open={showSupportModal} onClose={() => setShowSupportModal(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        borderRadius: '20px',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6" component="h2">
                            Select a tier to support
                        </Typography>
                        {supportableTierCards()}
                    </Box>
                </Modal>
            </>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline/>
                <NavBar/>
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h2" component="div">
                        {title}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
                            <Paper sx={{padding: 2, flex: 1}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={8} sx={{display: 'flex', justifyContent: 'center'}}>
                                        <CardMedia
                                            component="img"
                                            image={imageURL}
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
                                            src={ownerImageUrl}
                                            alt="User profile image"
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Typography variant="body2" color="text.primary" sx={{ml: 1}}>
                                            {`${ownerFirstName} ${ownerLastName}`}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {formatDate(creationDate)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="body1" component="div">
                                    {description}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
                            <Paper sx={{padding: 2, flex: 1}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-evenly', marginBottom: '15px'}}>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <GroupIcon/>
                                        <Typography variant="body1" sx={{marginLeft: 1}}>
                                            {`Supporters: ${numberOfSupporters}`}
                                        </Typography>
                                    </Box>
                                    <Box sx={{alignItems: 'center', display: 'flex'}}>
                                        <PaidIcon/>
                                        <Typography variant="body1" sx={{marginLeft: 1}}>
                                            {`Money Raised: ${moneyRaised !== null ? moneyRaised : 0}`}
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
                                    ownerId === parseInt(localStorage.getItem("userId") as string)
                                        ? <>{ownerActionButtons()}</>
                                        : localStorage.getItem("userId") === null
                                            ? <>{unauthenticatedUserActionButtons()}</>
                                            : <>{supporterActionButtons()}</>
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <SupportersGrid supporters={supporters} supportTiers={supportTiers}/>
                        </Grid>
                    </Grid>
                    <Box sx={{padding: 2, marginTop: 4}}>
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
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
