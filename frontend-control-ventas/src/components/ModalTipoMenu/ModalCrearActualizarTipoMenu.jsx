import React, { useState, useEffect } from "react";
import CrearTipoMenu from "../CrudTiposMenus/CrearTipoMenu";
import ActualizarTipoMenu from "../CrudTiposMenus/ActualizarTipoMenu";
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

const ModalCrearActualizarTipoMenu = ({
  open,
  onClose,
  onTipoMenuCreado,
  tipoMenu,
}) => {
  const [formData, setFormData] = useState({ nombre_tipo: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (open) {
      if (tipoMenu) {
        setFormData(tipoMenu);
      } else {
        setFormData({ nombre_tipo: "" });
      }
    }
  }, [tipoMenu, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tipoMenu) {
        await ActualizarTipoMenu(formData);
        setSnackbarMessage("El tipo de menú fue actualizado correctamente");
        setSnackbarSeverity("success");
      } else {
        await CrearTipoMenu(formData);
        setSnackbarMessage("El tipo de menú fue creado correctamente");
        setSnackbarSeverity("success");
      }

      setSnackbarOpen(true);
      onClose();
      setFormData({ nombre_tipo: "" });

      if (onTipoMenuCreado) {
        onTipoMenuCreado();
      }
    } catch {
      setSnackbarMessage(
        tipoMenu
          ? "Error al actualizar el tipo de menú"
          : "Error al crear el tipo de menú"
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
              {tipoMenu ? "Actualizar Tipo de Menú" : "Crear Tipo de Menú"}
            </Typography>
            <TextField
              id="nombre_tipo"
              name="nombre_tipo"
              label="Nombre del Tipo de Menú"
              fullWidth
              margin="normal"
              value={formData.nombre_tipo}
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
                {tipoMenu ? "Actualizar Tipo de Menú" : "Crear Tipo de Menú"}
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

export default ModalCrearActualizarTipoMenu;
