import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Card, CardMedia} from "@mui/material";

import {petitionImageUrl, userImageUrl} from "../model/api.ts";
import {PetitionOverview} from "../model/responseBodies.ts";
import Typography from "@mui/material/Typography";
import {formatDate} from "../model/util.ts";
import Avatar from "@mui/material/Avatar";


// The majority of this code was taken from the Material-UI example at
// https://github.com/mui/material-ui/blob/v5.15.16/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

interface PetitionCardProps {
    petitionOverview: PetitionOverview,
    categoryMap: Map<number, string>
}


const defaultTheme = createTheme();

export default function PetitionCard(
    {petitionOverview, categoryMap}: PetitionCardProps
): React.ReactElement {
    const {
        petitionId,
        title,
        creationDate,
        categoryId,
        supportingCost,
        ownerId,
        ownerFirstName,
        ownerLastName
    } = petitionOverview;
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Card sx={{
                    marginTop: 3,
                    padding: 2,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}>
                    <CardMedia
                        component="img"
                        image={petitionImageUrl(petitionId)}
                        alt="petition"
                    />
                    <Typography variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(creationDate)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {`Category: ${categoryMap.get(categoryId)}`}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {`Supporting cost: ${supportingCost === 0 ? 'Free' : supportingCost}`}
                    </Typography>
                    <Box sx={{
                        left: 0,
                        bottom: 0,
                        alignItems: 'center',
                        display: 'flex',
                        position: 'relative',
                    }}>
                        <Avatar
                            src={userImageUrl(ownerId)}
                            alt="User profile image"
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                            }}
                        />
                        <Typography variant="body1" color="text.primary" sx={{ml: 1}}>
                            {`${ownerFirstName} ${ownerLastName}`}
                        </Typography>
                    </Box>
                </Card>
            </Container>
        </ThemeProvider>
    );
}