import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import PaidIcon from '@mui/icons-material/Paid';

import {createTheme, ThemeProvider} from "@mui/material/styles";
import {SupportTier} from "../model/responseBodies.ts";
import Typography from "@mui/material/Typography";
import {Card} from "@mui/material";
import Box from "@mui/material/Box";


interface SupportTierCardProps {
    supportTier: SupportTier
}

const defaultTheme = createTheme();

export default function SupportTierCard({supportTier}: SupportTierCardProps): React.ReactElement {
    const {
        title,
        description,
        cost
    } = supportTier;

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Card sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h5" component="div">
                        {title}
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <PaidIcon/>
                        <Typography variant="body1" component="div">
                            {cost}
                        </Typography>
                    </Box>
                    <Typography variant="body1" component="div">
                        {description}
                    </Typography>
                </Card>
            </Container>
        </ThemeProvider>
    );
}