import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";

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
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Support Tier
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        id="supportTierTitle"
                        label="Title"
                    />
                    <TextField
                        required
                        fullWidth
                        id="supportTierDescription"
                        label="Description"
                    />
                    <TextField
                        required
                        fullWidth
                        id="supportTierCost"
                        label="Cost"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            addSupportTier(
                                (document.getElementById("supportTierTitle") as HTMLInputElement).value,
                                (document.getElementById("supportTierDescription") as HTMLInputElement).value,
                                parseFloat((document.getElementById("supportTierCost") as HTMLInputElement).value)
                            );
                        }}
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}