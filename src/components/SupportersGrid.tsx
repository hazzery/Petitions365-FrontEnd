import {Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React from "react";
import {Supporter} from "../model/responseBodies.ts";
import SupporterCard from "./SupporterCard.tsx";


interface SupportersGridProps {
    supporters: Supporter[],
    supportTierMap: Map<number, string>
}

export default function SupportersGrid({supporters, supportTierMap}: SupportersGridProps): React.ReactElement {
    function supporterCards(): React.ReactElement[] {
        return supporters.map(
            (supporter: Supporter, index: number) => <SupporterCard
                key={index}
                supporter={supporter}
                supportTierMap={supportTierMap}
            />
        );
    }

    return (
        <Card sx={{padding: 2, marginTop: 4}}>
            <Typography variant="h6" component="div">
                Supporters
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: '25px',
                marginY: '10px'
            }}>
                {supporters.length > 0? supporterCards() : <Typography variant="body1">No supporters yet</Typography>}
            </Box>
        </Card>
    );
}
