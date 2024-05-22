import React from "react";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {AbstractSupportTier} from "../model/responseBodies.ts";
import EditSupportTierCard from "./EditSupportTierCard.tsx";
import Button from "@mui/material/Button";

interface SupportTiersPaperProps {
    supportTiers: Array<AbstractSupportTier>,
    setSupportTiers: (supportTiers: Array<AbstractSupportTier>) => void,
    petitionId: string,
    numberOfSupporters: (supportTier: AbstractSupportTier) => number,
}

export default function SupportTiersPaper(
    {supportTiers, setSupportTiers, petitionId, numberOfSupporters}: SupportTiersPaperProps
): React.ReactElement {

    function addSupportTier(): void {
        const newSupportTier = {title: "", description: "", cost: "" as const};
        setSupportTiers(supportTiers.concat([newSupportTier]));
    }

    return (
        <Paper sx={{
            padding: '40px',
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            width: "100%",
            alignItems: "center",
        }}>
            <Typography variant="h4">Edit Support Tiers</Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                columnGap: "20px",
                width: "100%",
                justifyContent: "center",
            }}>
                {
                    supportTiers.map(
                        (supportTier: AbstractSupportTier, index: number) => <EditSupportTierCard
                            key={index}
                            index={index}
                            supportTier={supportTier}
                            petitionId={Number(petitionId)}
                            numberOfSupporters={numberOfSupporters(supportTier)}
                            removeSupportTierCard={(index: number) => {
                                setSupportTiers(supportTiers.filter((_, i) => i !== index));
                            }}
                        />
                    )
                }
            </Box>
            {
                supportTiers.length < 3 &&
                <Button variant="contained" onClick={addSupportTier}>
                    Add new support tier
                </Button>
            }
        </Paper>
    );
}