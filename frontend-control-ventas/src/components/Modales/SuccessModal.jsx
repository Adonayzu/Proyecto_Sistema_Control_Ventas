import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const SuccessModal = ({ open, onClose, title, description }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
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
        <Typography id="success-modal-title" variant="h6" component="h2">
          {title || "Operación exitosa"}
        </Typography>
        <Typography id="success-modal-description" sx={{ mt: 2 }}>
          {description || "La operación se completó correctamente."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;