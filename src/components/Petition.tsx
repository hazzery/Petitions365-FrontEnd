import React from "react";

import PaidIcon from "@mui/icons-material/Paid";
import CssBaseline from "@mui/material/CssBaseline";
import GroupIcon from "@mui/icons-material/Group";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Card, CardMedia} from "@mui/material";
import {useParams} from "react-router-dom";
import {AxiosResponse} from "axios";

import {getPetitionDetails, getSupportersOfPetition, petitionImageUrl, userImageUrl} from "../model/api.ts";
import {PetitionDetails, Supporter, SupportTier} from "../model/responseBodies.ts";
import {formatDate} from "../model/util.ts";
import Grid from "@mui/material/Grid";
import SupportTierCard from "./SupportTierCard.tsx";
import SupporterCard from "./SupporterCard.tsx";


const defaultTheme = createTheme();

export default function Petition() {
    const {petitionId} = useParams();

    const [creationDate, setCreationDate] = React.useState<string>("");
    const [imageURL, setImageURL] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [ownerImageUrl, setOwnerImageUrl] = React.useState<string>("");
    const [ownerFirstName, setOwnerFirstName] = React.useState<string>("");
    const [ownerLastName, setOwnerLastName] = React.useState<string>("");
    const [numberOfSupporters, setNumberOfSupporters] = React.useState<number>(NaN);
    const [moneyRaised, setMoneyRaised] = React.useState<number>(NaN);
    const [supportTiers, setSupportTiers] = React.useState<Array<SupportTier>>([]);
    const [supporters, setSupporters] = React.useState<Array<Supporter>>([]);
    const [supportTierMap, setSupportTierMap] = React.useState<Map<number, string>>(new Map());

    const petitionIdNumber = parseInt(petitionId as string);
    // if (isNaN(petitionIdNumber)) {
    //     return <NotFound/>;
    // }

    React.useEffect(() => {
        function fetchPetition(): void {
            getPetitionDetails(petitionIdNumber)
                .then((response: AxiosResponse<PetitionDetails>) => {
                    setCreationDate(response.data.creationDate);
                    setImageURL(petitionImageUrl(petitionIdNumber));
                    setTitle(response.data.title);
                    setDescription(response.data.description);
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

        fetchPetition();
        fetchSupporters();
    }, [petitionId, petitionIdNumber, supportTierMap]);

    function supportTierCards(): React.ReactElement[] {
        return supportTiers.map(
            (supportTier: SupportTier) => <SupportTierCard supportTier={supportTier}/>
        );
    }

    function supporterCards(): React.ReactElement[] {
        return supporters.map(
            (supporter: Supporter) => <SupporterCard supporter={supporter} supportTierMap={supportTierMap}/>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',

                    }}
                >
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
                                        {`Money Raised: ${moneyRaised}`}
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
                    </Grid>
                    <Card sx={{padding: 2, marginTop: 4}}>
                        <Typography variant="h6" component="div">
                            Supporters
                        </Typography>
                        <Box sx={{alignItems: 'center', display: 'flex', flexDirection: 'row'}}>
                            {supporterCards()}
                        </Box>
                    </Card>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
