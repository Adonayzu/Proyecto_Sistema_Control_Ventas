import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import AsignarRolModal from "../../../components/ModalesRoles/AsignarRolModal";
import ObtenerUsuarios from "../../../components/CrudUsuarios/ObtenerUsuarios";
import ObtenerRoles from "../../../components/AsignarEliminarRoles/ObtenerRoles";
import EliminarRol from "../../../components/AsignarEliminarRoles/EliminarRol";

const Roles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [roles, setRoles] = useState([]);
  const [openAsignarModal, setOpenAsignarModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await ObtenerUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    cargarUsuarios();
  }, []);

 
  const obtenerRoles = async (idUsuario) => {
    try {
      const roles = await ObtenerRoles(idUsuario);
      setRoles(Array.isArray(roles) ? roles : []); 
    } catch (error) {
      console.error("Error al obtener roles:", error);
      setRoles([]); 
    }
  };


  const handleUsuarioChange = (event) => {
    const idUsuario = event.target.value;
    setUsuarioSeleccionado(idUsuario);
    obtenerRoles(idUsuario);
  };


  const handleEliminarRol = async (idRol) => {
    try {
      await EliminarRol(idRol);
      obtenerRoles(usuarioSeleccionado); 
      setSnackbarMessage("Rol eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      setSnackbarMessage("Ocurrió un error al intentar eliminar el rol.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const handleRolAsignado = () => {
    obtenerRoles(usuarioSeleccionado); 
    setSnackbarMessage("Rol asignado exitosamente.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setOpenAsignarModal(false); 
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card sx={{ margin: 3, padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 3 }}
        >
          Gestión de Roles
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}
        >
          <Select
            id="select-usuario"
            name="usuario"
            value={usuarioSeleccionado}
            onChange={handleUsuarioChange}
            displayEmpty
            sx={{
              width: "50%",
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              "& .MuiSelect-select": { padding: "10px" },
            }}
          >
            <MenuItem value="" disabled>
              Selecciona un usuario
            </MenuItem>
            {usuarios.map((usuario) => (
              <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                {usuario.nombres} {usuario.apellidos}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {usuarioSeleccionado && (
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}
            >
              Roles Asignados
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAsignarModal(true)}
              >
                Asignar Nuevo Rol
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              {roles.length > 0 ? (
                roles.map((rol) => (
                  <Box
                    key={rol.id_rol}
                    sx={{
                      width: "80%",
                      padding: 2,
                      backgroundColor: "#f1f8e9",
                      borderRadius: 1,
                      boxShadow: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {rol.nombre_menu} - {rol.nombre_modulo}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleEliminarRol(rol.id_rol)}
                    >
                      Eliminar Rol
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No hay roles asignados a este usuario.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <AsignarRolModal
        open={openAsignarModal}
        onClose={() => setOpenAsignarModal(false)}
        usuarioSeleccionado={usuarioSeleccionado}
        roles={roles}
        onRolAsignado={handleRolAsignado}
      />

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
    </Card>
  );
};

export default Roles;
