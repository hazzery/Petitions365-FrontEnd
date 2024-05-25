import React from "react";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {AbstractSupportTier, PetitionDetails, Supporter, SupportTier} from "../model/responseBodies.ts";
import EditSupportTierCard from "./EditSupportTierCard.tsx";
import Button from "@mui/material/Button";
import {getPetitionDetails, getSupportersOfPetition} from "../model/api.ts";
import {AxiosResponse} from "axios";

interface SupportTiersPaperProps {
    supportTiers: Array<SupportTier>,
    petitionId: string
}

export default function SupportTiersPaper(
    {supportTiers, petitionId}: SupportTiersPaperProps
): React.ReactElement {
    const [concreteSupportTiers, setConcreteSupportTiers] = React.useState<Array<SupportTier>>(supportTiers);
    const [supportTierCards, setSupportTierCards] = React.useState<Array<AbstractSupportTier>>(supportTiers);
    const [supportersMap, setSupportersMap] = React.useState<Map<number, Array<Supporter>>>(new Map());
    const [reFetch, setReFetch] = React.useState<boolean>(false);

    React.useEffect(() => {
        setSupportTierCards(supportTiers);
        setConcreteSupportTiers(supportTiers);
    }, [supportTiers]);

    React.useEffect(() => {
        getSupportersOfPetition(parseInt(petitionId))
            .then((response: AxiosResponse<Array<Supporter>>) => {
                const map = new Map<number, Array<Supporter>>();
                response.data.forEach((supporter: Supporter) => {
                    if (!map.has(supporter.supportTierId)) {
                        map.set(supporter.supportTierId, []);
                    }
                    map.get(supporter.supportTierId)?.push(supporter);
                });
                setSupportersMap(map);
            })
            .catch(() => null);
    }, [petitionId]);

    React.useEffect(() => {
        getPetitionDetails(Number(petitionId))
            .then((response: AxiosResponse<PetitionDetails>) => setConcreteSupportTiers(response.data.supportTiers))
            .catch(() => null);
    }, [petitionId, reFetch]);

    function addSupportTier(): void {
        const newSupportTier = {title: "", description: "", cost: "" as const};
        setSupportTierCards(supportTierCards.concat([newSupportTier]));
    }

    function numberOfSupporters(supportTier: AbstractSupportTier): number {
        return supportTier.supportTierId
            ? supportersMap.get(supportTier.supportTierId)?.length ?? 0
            : 0;
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
                    supportTierCards.map(
                        (supportTier: AbstractSupportTier, index: number) => <EditSupportTierCard
                            key={index}
                            index={index}
                            supportTier={supportTier}
                            petitionId={Number(petitionId)}
                            numberOfSupporters={numberOfSupporters(supportTier)}
                            removeSupportTierCard={(index: number) => {
                                setSupportTierCards(supportTierCards.filter((_, i) => i !== index));
                            }}
                            onlySupportTier={
                                concreteSupportTiers.length === 1 && supportTier.supportTierId !== undefined
                            }
                            reFetch={() => setReFetch(!reFetch)}
                        />
                    )
                }
            </Box>
            {
                supportTierCards.length < 3 &&
                <Button variant="contained" onClick={addSupportTier}>
                    Add new support tier
                </Button>
            }
        </Paper>
    );
}