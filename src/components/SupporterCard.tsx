import React from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, CardMedia} from "@mui/material";

import {Supporter} from "../model/responseBodies.ts";
import {formatDate} from "../model/util.ts";
import {userImageUrl} from "../model/api.ts";


interface SupporterCardProps {
    supporter: Supporter,
    supportTierMap: Map<number, string>
}

export default function SupporterCard({supporter, supportTierMap}: SupporterCardProps): React.ReactElement {
    const {
        supportTierId,
        message,
        supporterId,
        supporterFirstName,
        supporterLastName,
        timestamp
    } = supporter;

    function setDefaultImage(event: React.SyntheticEvent<HTMLImageElement>) {
        event.currentTarget.src = "https://www.svgrepo.com/show/486506/user-profile-filled.svg"
    }

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '250px',
            height: '350px'
        }}>
            <CardMedia
                component="img"
                height="160px"
                image={userImageUrl(supporterId)}
                alt="Supporter profile image"
                onError={setDefaultImage}
            />
            <CardContent>
                <Typography variant="h6">
                    {supporterFirstName} {supporterLastName}
                </Typography>
                <Typography>
                    {message}
                </Typography>
            </CardContent>
            <CardContent>
                <Typography variant="body1">
                    {supportTierMap.get(supportTierId)}
                </Typography>
                <Typography variant="body2">
                    {formatDate(timestamp)}
                </Typography>
            </CardContent>
        </Card>
    );
}
