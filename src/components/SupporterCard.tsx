import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Card, CardMedia} from "@mui/material";
import {Supporter} from "../model/responseBodies.ts";
import Typography from "@mui/material/Typography";
import {formatDate} from "../model/util.ts";
import {userImageUrl} from "../model/api.ts";


interface SupporterCardProps {
    supporter: Supporter,
    supportTierMap: Map<number, string>
}

const defaultTheme = createTheme();

export default function SupporterCard({supporter, supportTierMap}: SupporterCardProps): React.ReactElement {
    const {
        supportTierId,
        message,
        supporterId,
        supporterFirstName,
        supporterLastName,
        timestamp
    } = supporter;

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Card sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={userImageUrl(supporterId)}
                        alt="Supporter profile image"
                    />
                    <Typography variant="h6">
                        {supporterFirstName} {supporterLastName}
                    </Typography>
                    <Typography variant="body1">
                        {supportTierMap.get(supportTierId)}
                    </Typography>
                    <Typography>
                        {message}
                    </Typography>
                    <Typography variant="body2">
                        {formatDate(timestamp)}
                    </Typography>
                </Card>
            </Container>
        </ThemeProvider>
    );
}
