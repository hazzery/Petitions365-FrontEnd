import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import GroupIcon from "@mui/icons-material/Group";
import Typography from "@mui/material/Typography";
import PaidIcon from "@mui/icons-material/Paid";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Card, CardMedia} from "@mui/material";
import {useParams} from "react-router-dom";
import {AxiosResponse} from "axios";

import {
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
import SupportTierCard from "./SupportTierCard.tsx";
import PetitionsGrid from "./PetitionsGrid.tsx";
import NavBar from "./NavBar.tsx";
import {formatDate} from "../model/util.ts";
import SupportersGrid from "./SupportersGrid.tsx";


const defaultTheme = createTheme();

export default function Petition() {
    const {petitionId} = useParams();

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
    const [supportTierMap, setSupportTierMap] = React.useState<Map<number, string>>(new Map());
    const [similarPetitions, setSimilarPetitions] = React.useState<Array<PetitionOverview>>([]);
    const [categoryMap, setCategoryMap] = React.useState<Map<number, string>>(new Map());

    // if (isNaN(petitionIdNumber)) {
    //     return <NotFound/>;
    // }
    React.useEffect(() => {
        const petitionIdNumber = parseInt(petitionId as string);

        function fetchPetition(): void {
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
                    const map = new Map<number, string>();
                    for (const supportTier of response.data.supportTiers) {
                        map.set(supportTier.supportTierId, supportTier.title);
                    }
                    setSupportTierMap(map);
                })
                .catch((error) => {
                    setTitle(error.response.status.toString());
                    setDescription(error.response.statusText);
                });
        }

        function fetchSupporters(): void {
            getSupportersOfPetition(petitionIdNumber)
                .then((response: AxiosResponse<Array<Supporter>>) => {
                    setSupporters(response.data);
                })
                .catch((error) => {
                    setTitle(error.response.status.toString());
                    setDescription(error.response.statusText);
                });
        }

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

        function fetchSimilarPetitions(): void {
            if (!isNaN(categoryId) && !isNaN(ownerId)) {
                mergePetitionListPromises(
                    setSimilarPetitions,
                    getFilteredPetitions({categoryIds: [categoryId]}),
                    getFilteredPetitions({ownerId: ownerId})
                );
            }
        }

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

        fetchPetition();
        fetchSupporters();
        fetchSimilarPetitions();
    }, [categoryId, ownerId, petitionId]);

    function supportTierCards(): React.ReactElement[] {
        return supportTiers.map(
            (supportTier: SupportTier, index: number) => <SupportTierCard key={index} supportTier={supportTier}/>
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
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
                            <Card sx={{padding: 2, flex: 1}}>
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
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
                            <Card sx={{padding: 2, flex: 1}}>
                                <Box sx={{left: 16, bottom: 16, alignItems: 'center', display: 'flex'}}>
                                    <GroupIcon/>
                                    <Typography variant="body1" color="text.primary" sx={{ml: 1}}>
                                        {`Supporters: ${numberOfSupporters}`}
                                    </Typography>
                                </Box>
                                <Box sx={{left: 16, bottom: 16, alignItems: 'center', display: 'flex'}}>
                                    <PaidIcon/>
                                    <Typography variant="body1" color="text.primary" sx={{ml: 1}}>
                                        {`Money Raised: ${moneyRaised !== null ? moneyRaised : 0}`}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" component="div">
                                    Support Tiers
                                </Typography>
                                <Box sx={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                                    {supportTierCards()}
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item sm={12}>
                            <SupportersGrid supporters={supporters} supportTierMap={supportTierMap}/>
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
