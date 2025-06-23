import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Typography, Button, Modal, Snackbar, Alert } from "@mui/material";
import { axiosInstance } from "../../services/axios.config";

const AsignarRolModal = ({ open, onClose, usuarioSeleccionado, roles, onRolAsignado }) => {
  const [menuNavegacion, setMenuNavegacion] = useState([]);
  const [menuSeleccionado, setMenuSeleccionado] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const obtenerMenus = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.get("/obtener_menus", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordenados = response.data.slice().sort((a, b) => a.id_menu - b.id_menu);
        setMenuNavegacion(ordenados);
      } catch (error) {
        console.error("Error al obtener los menús de navegación:", error);
      }
    };

    if (open) {
      obtenerMenus();
    } else {
      setMenuSeleccionado("");
    }
  }, [open]);

  const handleAsignarRol = async () => {
    const yaAsignado = roles.some(
      (rol) => rol.id_menu_navegacion === parseInt(menuSeleccionado)
    );

    if (yaAsignado) {
      setSnackbarMessage("Este menú ya ha sido asignado al usuario.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        "/asignar_roles",
        {
          id_usuario: usuarioSeleccionado,
          id_menu_navegacion: parseInt(menuSeleccionado),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onRolAsignado();
      setMenuSeleccionado("");
    } catch {
      setSnackbarMessage("Error al asignar el rol.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <>
      <Modal open={open} onClose={onClose}>
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
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Asignar Nuevo Rol
          </Typography>

          <Autocomplete
            options={menuNavegacion}
            getOptionLabel={(option) => option.nombre_menu || ""}
            value={
              menuNavegacion.find((menu) => menu.id_menu === Number(menuSeleccionado)) || null
            }
            onChange={(_, value) => setMenuSeleccionado(value ? value.id_menu : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona un menú"
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.id_menu === value?.id_menu
            }
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAsignarRol}
              disabled={!menuSeleccionado}
            >
              Asignar Rol
            </Button>
          </Box>
        </Box>
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

export default AsignarRolModal;