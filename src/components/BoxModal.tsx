import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";


interface BoxModalProps {
    open: boolean,
    onClose: () => void,
    children?: React.ReactNode
}

export default function BoxModal(
    {open, onClose, children}: BoxModalProps
): React.ReactElement {
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'background.paper',
                borderRadius: '20px',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {children}
            </Box>
        </Modal>
    );
}