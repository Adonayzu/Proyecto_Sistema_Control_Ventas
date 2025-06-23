import React, { useState, useEffect } from "react";
import CrearEscuela from "../CrudEscuelas/CrearEscuela";
import ActualizarEscuela from "../CrudEscuelas/ActualizarEscuela";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #1976d2",
  boxShadow: 24,
  p: 3,
};

const ModalCrearActualizarEscuela = ({
  open,
  onClose,
  onEscuelaCreada,
  escuela,
}) => {
  const [formData, setFormData] = useState({ nombre_escuela: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (escuela) {
        setFormData(escuela);
      } else {
        setFormData({ nombre_escuela: "" });
      }
    }
  }, [escuela, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (escuela) {
        await ActualizarEscuela(formData);
        setSnackbarMessage("La escuela fue actualizada correctamente");
        setSnackbarSeverity("success");
      } else {
        await CrearEscuela(formData);
        setSnackbarMessage("La escuela fue creada correctamente");
        setSnackbarSeverity("success");
      }
      setSnackbarOpen(true);
      onClose();
      setFormData({ nombre_escuela: "" });
      if (onEscuelaCreada) {
        onEscuelaCreada();
      }
    } catch (error) {
      const backendMsg = error?.response?.data?.msg;
      setSnackbarMessage(
        backendMsg ||
          (escuela
            ? "Error al actualizar la escuela"
            : "Error al crear la escuela")
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Modal
        aria-labelledby="modal-escuela-title"
        aria-describedby="modal-escuela-description"
        open={open}
        onClose={onClose}
        disablePortal={false}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box component="form" sx={style} onSubmit={handleSubmit}>
            <Typography
              id="modal-escuela-title"
              variant="h6"
              component="h2"
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              {escuela ? "Actualizar Escuela" : "Crear Escuela"}
            </Typography>
            <TextField
              id="nombre_escuela"
              name="nombre_escuela"
              label="Nombre de la Escuela"
              fullWidth
              margin="normal"
              value={formData.nombre_escuela}
              onChange={handleChange}
              required
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{ flex: 1, mr: 1 }}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ flex: 1 }}
              >
                {escuela ? "Actualizar Escuela" : "Crear Escuela"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalCrearActualizarEscuela;