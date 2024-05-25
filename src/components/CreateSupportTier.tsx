import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import useFieldValidation from "../hooks/useFieldValidation.ts";
import CostInput from "./CostInput.tsx";


const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
};

interface CreateSupportTierProps {
    open: boolean,
    handleClose: () => void,
    addSupportTier: (title: string, description: string, cost: number) => void
}

export default function CreateSupportTier(
    {open, handleClose, addSupportTier}: CreateSupportTierProps
): React.ReactElement {
    const [title, setTitle] = useFieldValidation({required: true, maxLength: 128});
    const [description, setDescription] = useFieldValidation({required: true, maxLength: 1024});
    const [cost, setCost] = React.useState<number | "">("");

    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

    function handleSubmit() {
        setFormSubmitted(true);

        if (title.error || description.error || cost === "") {
            return;
        }

        addSupportTier(title.value, description.value, cost);
        setFormSubmitted(false);
        setTitle("");
        setDescription("");
        setCost("");
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Support Tier
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        label="Title"
                        value={title.value}
                        onChange={(event) => setTitle(event.target.value)}
                        error={formSubmitted && Boolean(title.error)}
                        helperText={formSubmitted && title.error}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        value={description.value}
                        onChange={(event) => setDescription(event.target.value)}
                        error={formSubmitted && Boolean(description.error)}
                        helperText={formSubmitted && description.error}
                    />
                    <CostInput
                        required
                        fullWidth
                        label="Cost"
                        onChange={setCost}
                        formSubmitted={formSubmitted}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}