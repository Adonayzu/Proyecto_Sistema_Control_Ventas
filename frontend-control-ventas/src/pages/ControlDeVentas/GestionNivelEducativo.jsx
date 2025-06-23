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
import ObtenerNivelesEducativos from "../../components/CrudNivelEducativo/ObtenerNivelesEducativos";
import EliminarNivelEducativo from "../../components/CrudNivelEducativo/EliminarNivelEducativo";
import ModalCrearActualizarNivelEducativo from "../../components/ModalNivelEducativo/ModalCrearActualizarNivelEducativo";
import AddIcon from "@mui/icons-material/Add";

const GestionNivelEducativo = () => {
  const [nivelesEducativos, setNivelesEducativos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nivelEducativoSeleccionado, setNivelEducativoSeleccionado] =
    useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const cargarNivelesEducativos = async () => {
      try {
        const data = await ObtenerNivelesEducativos();
        setNivelesEducativos(data);
      } catch (error) {
        console.error("Error al obtener los niveles educativos:", error);
      }
    };

    cargarNivelesEducativos();
  }, []);

  const handleOpenModal = (nivelEducativo = null) => {
    setNivelEducativoSeleccionado(nivelEducativo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNivelEducativoSeleccionado(null);
  };

  const refrescarNivelesEducativos = async () => {
    try {
      const data = await ObtenerNivelesEducativos();
      setNivelesEducativos(data);
    } catch (error) {
      console.error("Error al obtener los niveles educativos:", error);
    }
  };

  const handleEliminarNivelEducativo = async (nivelEducativoId) => {
    try {
      await EliminarNivelEducativo(nivelEducativoId);

      await refrescarNivelesEducativos();

      setSnackbarMessage("Nivel educativo eliminado con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar el nivel educativo:", error);

      if (error.response && error.response.status === 400) {
        setSnackbarMessage(error.response.data.msg); 
      } else {
        setSnackbarMessage("Error al eliminar el nivel educativo.");
      }
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
          <Button variant="contained" color="primary" href="/menus">
            Regresar a Gestión de Menús
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
              Listado de Niveles Educativos
            </Typography>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              Niveles educativos registrados en el sistema.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ backgroundColor: "#009688" }}
          >
            Crear Nuevo Nivel Educativo
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">
                  Id Nivel Educativo
                </StyledTableCell>
                <StyledTableCell align="center">Nombre</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nivelesEducativos.map((nivelEducativo, index) => (
                <StyledTableRow
                  key={nivelEducativo.id_nivel_educativo || `row-${index}`}
                >
                  <StyledTableCell>
                    <Stack
                      direction="row"
                      justifyContent={"space-around"}
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() =>
                          handleEliminarNivelEducativo(
                            nivelEducativo.id_nivel_educativo
                          )
                        }
                      >
                        <Box
                          component="img"
                          src="icons/eliminar.png"
                          alt="Eliminar Nivel Educativo"
                          sx={{ width: 22, height: 22 }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenModal(nivelEducativo)}
                      >
                        <Box
                          component="img"
                          src="icons/actualizar.png"
                          alt="Actualizar Nivel Educativo"
                          sx={{ width: 22, height: 22 }}
                        />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {nivelEducativo.id_nivel_educativo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {nivelEducativo.nombre_nivel}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCrearActualizarNivelEducativo
        open={openModal}
        onClose={handleCloseModal}
        onNivelEducativoCreado={refrescarNivelesEducativos}
        nivelEducativo={nivelEducativoSeleccionado}
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

export default GestionNivelEducativo;
