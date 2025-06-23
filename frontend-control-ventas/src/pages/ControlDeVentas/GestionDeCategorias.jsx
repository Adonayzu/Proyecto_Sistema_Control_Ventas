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
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ModalCrearActualizarCategoria from "../../components/ModalCategoria/ModalCrearActualizarCategoria";
import EliminarCategoria from "../../components/CrudCategorias/EliminarCategoria";
import ObtenerCategorias from "../../components/CrudCategorias/ObtenerCategorias";
import AddIcon from "@mui/icons-material/Add";

const GestionDeCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const crearBtnRef = useRef(null);

  useEffect(() => {
    refrescarCategorias();
  }, []);

  const handleOpenModal = (categoria = null) => {
    setCategoriaSeleccionada(categoria);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCategoriaSeleccionada(null);
  };

  const handleModalExited = () => {
    if (crearBtnRef.current) {
      crearBtnRef.current.focus();
    }
  };

  const refrescarCategorias = async () => {
    try {
      const data = await ObtenerCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleEliminarCategoria = async (categoriaId) => {
    try {
      await EliminarCategoria(categoriaId);

      setCategorias((prevCategorias) =>
        prevCategorias.filter(
          (categoria) => categoria.id_categoria !== categoriaId
        )
      );

      setSnackbarMessage("Categoría eliminada con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);

      if (error.response && error.response.status === 400) {
        setSnackbarMessage(error.response.data.msg);
      } else {
        setSnackbarMessage("Error al eliminar la categoría.");
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
        <Box>
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
                Listado de Categorías
              </Typography>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{ color: "text.secondary" }}
              >
                Categorías registradas en el sistema.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              ref={crearBtnRef}
            >
              Crear Nueva Categoría
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Acciones</StyledTableCell>
                  <StyledTableCell align="center">Id Categoría</StyledTableCell>
                  <StyledTableCell align="center">Nombre</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.map((categoria) => (
                  <StyledTableRow key={categoria.id_categoria}>
                    <StyledTableCell>
                      <Stack
                        direction="row"
                        justifyContent={"space-around"}
                        alignItems="center"
                      >
                        <IconButton
                          onClick={() =>
                            handleEliminarCategoria(categoria.id_categoria)
                          }
                        >
                          <Box
                            component="img"
                            src="/icons/eliminar.png"
                            alt="Eliminar Categoría"
                            sx={{ width: 22, height: 22 }}
                          />
                        </IconButton>
                        <IconButton onClick={() => handleOpenModal(categoria)}>
                          <Box
                            component="img"
                            src="/icons/actualizar.png"
                            alt="Actualizar Categoría"
                            sx={{ width: 22, height: 22 }}
                          />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {categoria.id_categoria}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {categoria.nombre_categoria}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>

      <ModalCrearActualizarCategoria
        open={openModal}
        onClose={handleCloseModal}
        onCategoriaCreada={refrescarCategorias}
        categoria={categoriaSeleccionada}
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

export default GestionDeCategorias;