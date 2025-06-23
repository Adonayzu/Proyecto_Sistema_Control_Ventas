import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CrearCategoria from "../CrudCategorias/CrearCategoria";
import ActualizarCategoria from "../CrudCategorias/ActualizarCategoria";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 24,
  p: 4,
};

const ModalCrearActualizarCategoria = ({
  open,
  onClose,
  onCategoriaCreada,
  categoria,
}) => {
  const [formData, setFormData] = useState({ nombre_categoria: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (categoria) {
        setFormData({ nombre_categoria: categoria.nombre_categoria });
      } else {
        setFormData({ nombre_categoria: "" });
      }
    }
  }, [categoria, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nombre_categoria.trim()) {
        setSnackbarMessage("El nombre de la categoría es obligatorio.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (categoria) {
        await ActualizarCategoria({ ...categoria, ...formData });
        setSnackbarMessage("La categoría fue actualizada correctamente.");
        setSnackbarSeverity("success");
      } else {
        await CrearCategoria(formData);
        setSnackbarMessage("La categoría fue creada correctamente.");
        setSnackbarSeverity("success");
      }

      setSnackbarOpen(true);
      if (onCategoriaCreada) onCategoriaCreada();
      onClose();
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      const errorMessage =
        error.response?.data?.msg ||
        "Ocurrió un error al guardar la categoría.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal
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
              variant="h6"
              component="h2"
              gutterBottom
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              {categoria ? "Actualizar Categoría" : "Crear Nueva Categoría"}
            </Typography>
            <TextField
              required
              id="nombre_categoria"
              name="nombre_categoria"
              label="Nombre de la Categoría"
              fullWidth
              margin="normal"
              value={formData.nombre_categoria}
              onChange={handleChange}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Button
                onClick={onClose}
                color="secondary"
                variant="contained"
                sx={{ flex: 1, mr: 1 }}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ flex: 1 }}
              >
                {categoria ? "Actualizar Categoría" : "Crear Categoría"}
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

export default ModalCrearActualizarCategoria;
