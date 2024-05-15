import React from "react";
import PetitionCard from "./PetitionCard.tsx";

import {PetitionOverview} from "../model/responseBodies.ts";
import {Paper} from "@mui/material";


interface PetitionsGridProps {
    petitions: Array<PetitionOverview>,
    categoryMap: Map<number, string>
}

export default function PetitionsGrid(
    {petitions, categoryMap, children}: PetitionsGridProps & { children: React.ReactNode | undefined }
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
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
            }}>
                {petitionCards()}
                {children}
            </Paper>
    );
}