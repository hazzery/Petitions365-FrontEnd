import React from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from '@mui/material/Box';
import {Card, CardMedia, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {petitionImageUrl, userImageUrl} from "../model/api.ts";
import {PetitionOverview} from "../model/responseBodies.ts";
import {formatDate} from "../model/util.ts";


interface PetitionCardProps {
    petitionOverview: PetitionOverview,
    categoryMap: Map<number, string>
}

export default function PetitionCard(
    {petitionOverview, categoryMap}: PetitionCardProps
): React.ReactElement {
    const navigate = useNavigate();
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

    const theme = useTheme();

    return (
        <Card onClick={() => navigate("/petition/" + petitionId)} sx={{
            padding: 2,
            width: '30%',
            position: 'relative',
            cursor: 'pointer',
            ":hover": {
                backgroundColor: theme.palette.action.focus
            }
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
                {`Supporting cost: ${supportingCost === 0 ? 'Free' : '$' + supportingCost}`}
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
    );
}