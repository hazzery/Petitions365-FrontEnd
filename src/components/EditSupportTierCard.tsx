import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {Alert, Card, CardActions, CardContent} from "@mui/material";

import CostInput from "./CostInput.tsx";
import {AbstractSupportTier, PetitionDetails} from "../model/responseBodies.ts";
import {createSupportTier, deleteSupportTier, editSupportTier, getPetitionDetails} from "../model/api.ts";
import {formatServerResponse} from "../model/util.ts";
import {AxiosResponse} from "axios";


interface EditSupportTierProps {
    supportTier: AbstractSupportTier,
    numberOfSupporters: number,
    removeSupportTierCard: (index: number) => void,
    petitionId: number,
    index: number
}

export default function EditSupportTierCard(
    {supportTier, numberOfSupporters, removeSupportTierCard, petitionId, index}: EditSupportTierProps
): React.ReactElement {
    const [title, setTitle] = React.useState<string>(supportTier?.title ?? "");
    const [description, setDescription] = React.useState<string>(supportTier?.description ?? "");
    const [cost, setCost] = React.useState<number | "">(supportTier?.cost ?? "");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [success, setSuccess] = React.useState<boolean>(false);

    function showSuccess() {
        setSuccess(true);
        setErrorMessage("");
        setTimeout(() => setSuccess(false), 3000);
    }

    function addSupportTier() {
        createSupportTier(petitionId, title, description, cost as number)
            .then(() => {
                getPetitionDetails(petitionId)
                    .then((response: AxiosResponse<PetitionDetails>) => {
                        for (const tier of response.data.supportTiers) {
                            if (tier.title === title) {
                                supportTier.supportTierId = tier.supportTierId;
                                break;
                            }
                        }
                    })
                    .catch(() => null);
                showSuccess();
            })
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    function updateSupportTier() {
        editSupportTier(petitionId, supportTier.supportTierId as number, title, description, cost as number)
            .then(showSuccess)
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    function removeSupportTier() {
        deleteSupportTier(petitionId, supportTier.supportTierId as number)
            .then(() => removeSupportTierCard(index))
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    function actionButtons() {
        if (supportTier.supportTierId !== undefined) {
            return <>
                <Button fullWidth variant="contained" color="error" onClick={removeSupportTier}>
                    Delete
                </Button>
                <Button fullWidth variant="contained" onClick={updateSupportTier}>
                    Save
                </Button>
            </>;
        }

        return <>
            <Button fullWidth variant="contained" color="error" onClick={() => removeSupportTierCard(index)}>
                Delete
            </Button>
            <Button fullWidth variant="contained" onClick={addSupportTier}>
                Create
            </Button>
        </>;
    }

    function SupportTierFields() {
        return <Card sx={{height: "100%", padding: "10px", width: "100%"}}>
            <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "20px"
            }}>
                <TextField
                    required
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                />
                <TextField
                    required
                    fullWidth
                    multiline
                    label="Description"
                    value={description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                />
                <CostInput
                    fullWidth
                    required
                    label="Cost"
                    defaultValue={cost}
                    onChange={setCost}
                />
                <Alert severity="error" sx={{display: errorMessage === "" ? "none" : "block", width: "100%"}}>
                    {errorMessage}
                </Alert>
                <Alert severity="success" sx={{display: success ? "block" : "none", width: "100%"}}>
                    Support tier saved successfully
                </Alert>
            </CardContent>
            <CardActions sx={{display: "flex", gap: "20px"}}>
                {actionButtons()}
            </CardActions>
        </Card>;
    }

    return (
        <Box>
            {
                numberOfSupporters === 0
                    ? SupportTierFields()
                    : <Typography variant="body1">Tier '{title}' has supporters and cannot be edited.</Typography>
            }
        </Box>
    );
}