import React from "react";
import PetitionCard from "./PetitionCard.tsx";

import {PetitionOverview} from "../model/responseBodies.ts";
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";


interface PetitionsGridProps {
    petitions: Array<PetitionOverview>,
    categoryMap: Map<number, string>
}

export default function PetitionsGrid(
    {
        petitions, categoryMap, title = undefined, children = undefined
    }: PetitionsGridProps & { title: React.ReactNode | undefined, children: React.ReactNode | undefined }
): React.ReactElement {
    function petitionCards() {
        return petitions.map(
            (petition: PetitionOverview) => <PetitionCard
                key={petition.petitionId}
                petitionOverview={petition}
                categoryMap={categoryMap}
            />
        );
    }

    return (
        <Paper sx={{
            padding: '20px',
            maxWidth: '75vw',
            width: '75vw',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        }}>
            {title}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                rowGap: '40px',
                justifyContent: 'center',
                width: '100%'
            }}>
                {petitionCards()}
            </Box>
            {children}
        </Paper>
    );
}