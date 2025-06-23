import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import ModalCrearActualizarUsuario from "../../../components/ModalUsuario/ModalCrearActualizarUsuario";
import EliminarUsuario from "../../../components/CrudUsuarios/EliminarUsuario";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/EstilosTablas/StyledTableCell";
import ObtenerUsuarios from "../../../components/CrudUsuarios/ObtenerUsuarios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const crearBtnRef = useRef(null); 

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

  const handleUsuarioCreado = async () => {
    try {
      const data = await ObtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al actualizar los usuarios:", error);
    }
  };

  const handleEliminarUsuario = async (idUsuario) => {
    try {
      await EliminarUsuario(idUsuario);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.id_usuario !== idUsuario)
      );
      setSnackbarMessage("Usuario eliminado con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setSnackbarMessage("Ocurrió un error al intentar eliminar el usuario.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

 
  const handleCloseModal = () => {
    setOpenModal(false);
    setUsuarioSeleccionado(null);
  };


  const handleModalExited = () => {
    if (crearBtnRef.current) {
      crearBtnRef.current.focus();
    }
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Listado de Usuarios
            </Typography>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              Usuarios registrados en el sistema.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setUsuarioSeleccionado(null);
              setOpenModal(true);
            }}
            ref={crearBtnRef}
          >
            Crear Nuevo Usuario
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">Id Usuario</StyledTableCell>
                <StyledTableCell align="center">Usuario</StyledTableCell>
                <StyledTableCell align="center">Nombres</StyledTableCell>
                <StyledTableCell align="center">Apellidos</StyledTableCell>
                <StyledTableCell align="center">Teléfono</StyledTableCell>
                <StyledTableCell align="center">Dirección</StyledTableCell>
                <StyledTableCell align="center">Puesto</StyledTableCell>
                <StyledTableCell align="center">Fecha Creación</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <StyledTableRow key={usuario.id_usuario}>
                  <StyledTableCell>
                    <Stack
                      direction="row"
                      justifyContent={"space-around"}
                      alignItems="center"
                    >
                      <IconButton
                        variant="contained"
                        onClick={() =>
                          handleEliminarUsuario(usuario.id_usuario)
                        }
                      >
                        <Box
                          component="img"
                          src="/icons/eliminar.png"
                          alt="Eliminar"
                          sx={{ width: 20, height: 20 }}
                        />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        onClick={() => {
                          setUsuarioSeleccionado(usuario);
                          setOpenModal(true);
                        }}
                      >
                        <Box
                          component="img"
                          src="/icons/modificar.png"
                          alt="Modificar"
                          sx={{ width: 20, height: 20 }}
                        />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="center">
                    {usuario.id_usuario}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.usuario}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.nombres}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.apellidos}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.telefono}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.direccion}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.puesto}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {usuario.fecha_creacion}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCrearActualizarUsuario
        open={openModal}
        onClose={handleCloseModal}
        onUsuarioCreado={handleUsuarioCreado}
        usuario={usuarioSeleccionado}
        onExited={handleModalExited}
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

export default Usuarios;