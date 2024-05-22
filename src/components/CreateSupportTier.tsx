import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CostInput from "./CostInput.tsx";


const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
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
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [cost, setCost] = React.useState<number | "">("");

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
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <CostInput
                        required
                        fullWidth
                        label="Cost"
                        onChange={setCost}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => addSupportTier(title, description, cost as number)}
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}