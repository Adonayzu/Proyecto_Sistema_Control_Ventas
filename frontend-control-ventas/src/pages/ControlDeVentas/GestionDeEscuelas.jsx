import React, { useState, useEffect } from "react";
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
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerEscuelas from "../../components/CrudEscuelas/ObtenerEscuelas";
import EliminarEscuela from "../../components/CrudEscuelas/EliminarEscuela";
import ModalCrearActualizarEscuela from "../../components/ModalEscuela/ModalCrearActualizarEscuela";
import AddIcon from "@mui/icons-material/Add";

const GestionDeEscuelas = () => {
  const [escuelas, setEscuelas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    refrescarEscuelas();
  }, []);

  const refrescarEscuelas = async () => {
    try {
      const data = await ObtenerEscuelas();
      setEscuelas(data);
    } catch (error) {
      console.error("Error al obtener las escuelas:", error);
    }
  };

  const handleOpenModal = (escuela = null) => {
    setEscuelaSeleccionada(escuela);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEscuelaSeleccionada(null);
  };

  const handleEliminarEscuela = async (idEscuela) => {
    try {
      await EliminarEscuela(idEscuela);
      await refrescarEscuelas();
      setSnackbarMessage("Escuela eliminada con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error al eliminar la escuela.", error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Button variant="contained" color="primary" href="/semanapedidos">
            Regresar a Semanas de Pedidos
          </Button>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
            marginTop: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Listado de Escuelas
            </Typography>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              Escuelas registradas en el sistema.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ backgroundColor: "#009688" }}
          >
            Crear Nueva Escuela
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">Id Escuela</StyledTableCell>
                <StyledTableCell align="center">Nombre</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {escuelas.map((escuela, index) => (
                <StyledTableRow key={escuela.id_escuela || `row-${index}`}>
                  <StyledTableCell>
                    <Stack
                      direction="row"
                      justifyContent={"space-around"}
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() =>
                          handleEliminarEscuela(escuela.id_escuela)
                        }
                      >
                        <Box
                          component="img"
                          src="icons/eliminar.png"
                          alt="Eliminar Escuela"
                          sx={{ width: 22, height: 22 }}
                        />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal(escuela)}>
                        <Box
                          component="img"
                          src="icons/actualizar.png"
                          alt="Actualizar Escuela"
                          sx={{ width: 22, height: 22 }}
                        />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {escuela.id_escuela}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {escuela.nombre_escuela}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCrearActualizarEscuela
        open={openModal}
        onClose={handleCloseModal}
        onEscuelaCreada={refrescarEscuelas}
        escuela={escuelaSeleccionada}
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

export default GestionDeEscuelas;
