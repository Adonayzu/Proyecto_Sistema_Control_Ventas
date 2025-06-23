import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ErrorModal = ({ open, onClose, title, description }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
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
        <Typography id="error-modal-title" variant="h6" component="h2" color="error">
          {title || "Error"}
        </Typography>
        <Typography id="error-modal-description" sx={{ mt: 2 }}>
          {description || "Ocurrió un error. Por favor, inténtalo de nuevo."}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;