import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import SupportTierCard from "./SupportTierCard.tsx";
import BoxModal from "./BoxModal.tsx";
import {Supporter, SupportTier} from "../model/responseBodies.ts";
import {supportPetition} from "../model/api.ts";

interface supportableTierCardsProps {
    supporters: Supporter[],
    supportTiers: SupportTier[],
    setSelectedSupportTier: React.Dispatch<React.SetStateAction<SupportTier | null>>,
    setShowMessageModal: React.Dispatch<React.SetStateAction<boolean>>
}

function SupportableTierCards(
    {supporters, supportTiers, setSelectedSupportTier, setShowMessageModal}: supportableTierCardsProps
): React.ReactElement[] {
    const supportedTiers = supporters.filter(
        (supporter: Supporter) => supporter.supporterId === parseInt(localStorage.getItem("userId") as string)
    ).map((supporter: Supporter) => supporter.supportTierId);

    const supportableTiers = supportTiers.filter(
        (supportTier: SupportTier) => !supportedTiers.includes(supportTier.supportTierId)
    );

    return supportableTiers.map(
        (supportTier: SupportTier, index: number) => <SupportTierCard
            key={index}
            supportTier={supportTier}
            onClick={() => {
                setSelectedSupportTier(supportTier);
                setShowMessageModal(true);
            }}
            sx={{
                ":hover": {
                    backgroundColor: "#f0f0f0"
                }
            }}
        />
    );
}

interface SelectTierModalProps {
    open: boolean,
    onClose: () => void,
    supporters: Supporter[],
    supportTiers: SupportTier[],
    petitionId: number,
    causeReFetch: () => void
}

export default function SelectTierModal(
    {
        open,
        onClose,
        supporters,
        supportTiers,
        petitionId,
        causeReFetch
    }: SelectTierModalProps
): React.ReactElement {
    const [selectedSupportTier, setSelectedSupportTier] = React.useState<SupportTier | null>(null);
    const [showMessageModal, setShowMessageModal] = React.useState<boolean>(false);

    return (
        <BoxModal
            open={open}
            onClose={onClose}
        >
            <Typography variant="h6" component="h2">
                Select a tier to support
            </Typography>
            <SupportableTierCards
                supporters={supporters}
                supportTiers={supportTiers}
                setSelectedSupportTier={setSelectedSupportTier}
                setShowMessageModal={setShowMessageModal}
            />
            {
                selectedSupportTier &&
                <SupportMessageModal
                    open={showMessageModal}
                    onClose={() => {
                        onClose();
                        setShowMessageModal(false);
                    }}
                    supportTier={selectedSupportTier}
                    petitionId={petitionId}
                    causeReFetch={causeReFetch}
                />
            }
            <Button variant="contained" onClick={onClose}>
                Cancel
            </Button>
        </BoxModal>
    );
}


interface SupportMessageModalProps {
    open: boolean,
    onClose: () => void,
    supportTier: SupportTier,
    petitionId: number,
    causeReFetch: () => void
}

function SupportMessageModal(
    {open, onClose, supportTier, petitionId, causeReFetch}: SupportMessageModalProps
): React.ReactElement {
    const [message, setMessage] = React.useState<string>("");

    function supportSupportTier(supportTierId: number, message: string): void {
        supportPetition(petitionId, supportTierId, message)
            .then(() => {
                causeReFetch();
                onClose();
            })
            .catch(() => null);
    }

    return (
        <BoxModal open={open} onClose={onClose}>
            <Typography variant="h6" component="h2">
                {supportTier.title}
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={3}
                label="Message (Optional)"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
            />
            <Button variant="contained" onClick={onClose}>
                Cancel
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => supportSupportTier(supportTier.supportTierId, message)}
            >
                Support
            </Button>
        </BoxModal>
    );
}
