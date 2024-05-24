import {Card} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React from "react";
import {Supporter, SupportTier} from "../model/responseBodies.ts";
import SupporterCard from "./SupporterCard.tsx";


interface SupportersGridProps {
    supporters: Supporter[],
    supportTiers: Array<SupportTier>
}

export default function SupportersGrid({supporters, supportTiers}: SupportersGridProps): React.ReactElement {
    const [supportTierMap, setSupportTierMap] = React.useState<Map<number, string>>(new Map<number, string>());

    React.useEffect(() => {
        const map = new Map<number, string>();
        for (const supportTier of supportTiers) {
            map.set(supportTier.supportTierId, supportTier.title);
        }
        setSupportTierMap(map);
    }, [supportTiers]);

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
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '25px',
                marginY: '10px'
            }}>
                {supporters.length > 0? supporterCards() : <Typography variant="body1">No supporters yet</Typography>}
            </Box>
        </Card>
    );
}
