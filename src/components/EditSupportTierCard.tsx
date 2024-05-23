import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
    index: number,
    onlySupportTier: boolean
}

export default function EditSupportTierCard(
    {supportTier, numberOfSupporters, removeSupportTierCard, petitionId, index, onlySupportTier}: EditSupportTierProps
): React.ReactElement {
    const [title, setTitle] = React.useState<string>(supportTier?.title ?? "");
    const [description, setDescription] = React.useState<string>(supportTier?.description ?? "");
    const [cost, setCost] = React.useState<number | "">(supportTier?.cost ?? "");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [success, setSuccess] = React.useState<boolean>(false);

    function showSuccess(): void {
        setSuccess(true);
        setErrorMessage("");
        setTimeout(() => setSuccess(false), 3000);
    }

    function addSupportTier(): void {
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

    function updateSupportTier(): void {
        editSupportTier(petitionId, supportTier.supportTierId as number, title, description, cost as number)
            .then(showSuccess)
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    function removeSupportTier(): void {
        deleteSupportTier(petitionId, supportTier.supportTierId as number)
            .then(() => removeSupportTierCard(index))
            .catch((error) => setErrorMessage(formatServerResponse(error.response.statusText)));
    }

    function deletable(): boolean {
        return editable() && !onlySupportTier;
    }

    function editable(): boolean {
        return numberOfSupporters === 0;
    }

    function actionButtons() {
        if (supportTier.supportTierId !== undefined) {
            return <>
                <Button fullWidth variant="contained" color="error" onClick={removeSupportTier} disabled={!deletable()}>
                    Delete
                </Button>
                <Button fullWidth variant="contained" onClick={updateSupportTier} disabled={!editable()}>
                    Save
                </Button>
            </>;
        }

        return <>
            <Button fullWidth variant="contained" color="warning" onClick={() => removeSupportTierCard(index)}>
                Remove
            </Button>
            <Button fullWidth variant="contained" onClick={addSupportTier}>
                Create
            </Button>
        </>;
    }

    return (
        <Card sx={{height: "100%", minWidth: "33%", padding: "10px"}}>
            <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "20px",
                width: "100%"
            }}>
                <TextField
                    required
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                    disabled={!editable()}
                />
                <TextField
                    required
                    fullWidth
                    multiline
                    label="Description"
                    value={description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                    InputProps={{sx: {height: "150px", alignItems: "flex-start"}}}
                    disabled={!editable()}
                />
                <CostInput
                    fullWidth
                    required
                    label="Cost"
                    defaultValue={cost}
                    onChange={setCost}
                    disabled={!editable()}
                />
                <Alert severity="error" sx={{display: errorMessage === "" ? "none" : "block", width: "100%"}}>
                    {errorMessage}
                </Alert>
                <Alert severity="info"
                       sx={{display: onlySupportTier || numberOfSupporters > 0 ? "block" : "none", width: "100%"}}>
                    {numberOfSupporters > 0 ? "Cannot edit or delete support tier with supporters" : ""}
                    {onlySupportTier ? "Cannot delete, must have at least one tier" : ""}
                </Alert>
                <Alert severity="success" sx={{display: success ? "block" : "none", width: "100%"}}>
                    Support tier saved successfully
                </Alert>
            </CardContent>
            <CardActions sx={{display: "flex", gap: "20px"}}>
                {actionButtons()}
            </CardActions>
        </Card>
    );
}