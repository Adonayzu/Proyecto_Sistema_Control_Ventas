import React, { useState, useEffect } from "react";
import CrearNivelEducativo from "../CrudNivelEducativo/CrearNivelEducativo";
import ActualizarNivelEducativo from "../CrudNivelEducativo/ActualizarNivelEducativo";
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
  width: 490,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 50,
  p: 2,
};

const ModalCrearActualizarNivelEducativo = ({
  open,
  onClose,
  onNivelEducativoCreado,
  nivelEducativo,
}) => {
  const [formData, setFormData] = useState({ nombre_nivel: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (nivelEducativo) {
        setFormData(nivelEducativo);
      } else {
        setFormData({ nombre_nivel: "" });
      }
    }
  }, [nivelEducativo, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (nivelEducativo) {
        await ActualizarNivelEducativo(formData);
        setSnackbarMessage("El nivel educativo fue actualizado correctamente");
        setSnackbarSeverity("success");
      } else {
        await CrearNivelEducativo(formData);
        setSnackbarMessage("El nivel educativo fue creado correctamente");
        setSnackbarSeverity("success");
      }

      setSnackbarOpen(true);
      onClose();
      setFormData({ nombre_nivel: "" });

      if (onNivelEducativoCreado) {
        onNivelEducativoCreado();
      }
    } catch {
      setSnackbarMessage(
        nivelEducativo
          ? "Error al actualizar el nivel educativo"
          : "Error al crear el nivel educativo"
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
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
          <Box component={"form"} sx={style} onSubmit={handleSubmit}>
            <Typography
              id="transition-modal-title"
              variant="h5"
              component="h2"
              textAlign={"center"}
              sx={{ fontWeight: "bold" }}
            >
              {nivelEducativo
                ? "Actualizar Nivel Educativo"
                : "Crear Nivel Educativo"}
            </Typography>
            <TextField
              id="nombre_nivel"
              name="nombre_nivel"
              label="Nombre del Nivel Educativo"
              fullWidth
              margin="normal"
              value={formData.nombre_nivel}
              onChange={handleChange}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
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
                {nivelEducativo
                  ? "Actualizar Nivel Educativo"
                  : "Crear Nivel Educativo"}
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

export default ModalCrearActualizarNivelEducativo;
