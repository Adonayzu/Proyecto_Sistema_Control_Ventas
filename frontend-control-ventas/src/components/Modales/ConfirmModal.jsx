import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmModal = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography id="confirm-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={onClose} 
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm} 
          >
            Aceptar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;