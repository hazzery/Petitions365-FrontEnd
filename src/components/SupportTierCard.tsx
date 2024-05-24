import React from "react";
import Typography from "@mui/material/Typography";
import PaidIcon from '@mui/icons-material/Paid';
import Box from "@mui/material/Box";
import {Card} from "@mui/material";

import {SupportTier} from "../model/responseBodies.ts";


interface SupportTierCardProps {
    supportTier: SupportTier,
    onClick?: () => void
}

export default function SupportTierCard({supportTier, onClick}: SupportTierCardProps): React.ReactElement {
    const {
        title,
        description,
        cost
    } = supportTier;

    return (
        <Card onClick={onClick} sx={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: onClick !== undefined ? "pointer" : "default",
            width: "100%"
        }}>
            <Typography variant="h6" component="div">
                {title}
            </Typography>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <PaidIcon/>
                <Typography variant="body1" component="div">
                    {cost}
                </Typography>
            </Box>
            <Typography variant="body1" component="div">
                {description}
            </Typography>
        </Card>
    );
}