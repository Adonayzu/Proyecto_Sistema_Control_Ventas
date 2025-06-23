import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  TextField,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerSemanaPedidos from "../../components/CrudSemanaPedidos/ObtenerSemanaPedidos";
import EliminarSemanaPedido from "../../components/CrudSemanaPedidos/EliminarSemanaPedido";
import CerrarSemanaPedidos from "../../components/CrudSemanaPedidos/CerrarSemanaPedidos";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import ModalCrearActualizarSemanaPedido from "../../components/ModalSemanaPedido/ModalCrearActualizarSemanaPedido";

const ROWS_PER_PAGE = 20;

const GestionDeSemanasPedidos = () => {
  const [semanas, setSemanas] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openModal, setOpenModal] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtros, setFiltros] = useState({ descripcion: "" });


  const crearBtnRef = useRef(null);
  const actualizarBtnRefs = useRef({});
  const [lastTrigger, setLastTrigger] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    refrescarSemanas(currentPage, filtros.descripcion);
    // eslint-disable-next-line
  }, [currentPage]);

  const refrescarSemanas = async (page = 1, descripcion = "") => {
    try {
      const data = await ObtenerSemanaPedidos(
        page,
        ROWS_PER_PAGE,
        descripcion || null
      );
      setSemanas(data.semanas || []);
      setTotalPages(data.pages || 1);
    } catch {
      setSemanas([]);
      setTotalPages(1);
      setSnackbarMessage("Error al obtener las semanas.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleActualizarSemana = (semana) => {
    setSemanaSeleccionada(semana);
    setOpenModal(true);
    setLastTrigger(semana.id_semana_pedido);
  };

  const handleEliminarSemana = async (id_semana_pedido) => {
    try {
      await EliminarSemanaPedido(id_semana_pedido);
      setSnackbarMessage("Semana eliminada correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarSemanas(currentPage, filtros.descripcion);
    } catch (error) {
      let msg = "Error al eliminar la semana.";
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      }
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCrearSemana = () => {
    setSemanaSeleccionada(null);
    setOpenModal(true);
    setLastTrigger("crear");
  };

  const handleVerInforme = (semana) => {
    navigate(
      `/informesemanapedidos/${semana.id_semana_pedido}/${semana.id_escuela}?from=gestion`
    );
  };

  const handleCerrarSemana = async (id_semana_pedido) => {
    try {
      setLoading(true);
      await CerrarSemanaPedidos(id_semana_pedido);
      setSnackbarMessage("Semana cerrada exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarSemanas(currentPage, filtros.descripcion);
    } catch {
      setSnackbarMessage("Error al cerrar la semana.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (lastTrigger === "crear" && crearBtnRef.current) {
      crearBtnRef.current.focus();
    } else if (
      lastTrigger &&
      actualizarBtnRefs.current[lastTrigger] &&
      actualizarBtnRefs.current[lastTrigger].focus
    ) {
      actualizarBtnRefs.current[lastTrigger].focus();
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    refrescarSemanas(1, filtros.descripcion);
  };

  const cancelarBusqueda = () => {
    setFiltros({ descripcion: "" });
    setCurrentPage(1);
    refrescarSemanas(1, "");
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}
        >
          Gestión de Semanas de Pedidos
        </Typography>

        <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ marginBottom: 2 }}
        >
            <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/escuelas"
            >
            CATÁLOGO DE ESCUELAS
            </Button>

        </Stack>
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            variant="h4"
            paddingBottom={2}
            component="h2"
            sx={{ fontWeight: "bold" }}
          >
            Buscar Por Nombre de Semana
          </Typography>
          <Stack spacing={2} direction="row">
            <TextField
              label="Descripción de Semana"
              name="descripcion"
              value={filtros.descripcion || ""}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleBuscar}
              sx={{ backgroundColor: "#009688" }}
            >
              Buscar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={cancelarBusqueda}
            >
              Cancelar Búsqueda
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
            marginTop: 4,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Listado de Semanas
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleCrearSemana}
            sx={{ backgroundColor: "#009688" }}
            ref={crearBtnRef}
          >
            Crear Nueva Semana
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">Id Semana</StyledTableCell>
                <StyledTableCell align="center">
                  Descripción de Semana
                </StyledTableCell>
                <StyledTableCell align="center">Escuela</StyledTableCell>
                <StyledTableCell align="center">Fecha Inicio</StyledTableCell>
                <StyledTableCell align="center">Fecha Fin</StyledTableCell>
                <StyledTableCell align="center">Estado</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {semanas.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center">
                    No hay semanas registradas.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                semanas.map((semana) => (
                  <StyledTableRow key={semana.id_semana_pedido}>
                    <StyledTableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent={"space-around"}
                        alignItems="center"
                      >
                       
                    <Button
                    variant="contained"
                    size="small"
                    component={Link}
                    to={`/pedidos?semana=${semana.id_semana_pedido}&desc=${encodeURIComponent(semana.descripcion)}&escuela=${semana.id_escuela}`}
                    
                    >
                    Ver/Agregar Pedidos
                    </Button>

                        {semana.estado === "abierto" && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={loading}
                            onClick={() =>
                              handleCerrarSemana(semana.id_semana_pedido)
                            }
                          >
                            Cerrar semana
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleVerInforme(semana)}
                          sx={{ backgroundColor: "#009688" }}
                        >
                          Crear Informe
                        </Button>
                        <IconButton
                          onClick={() =>
                            handleEliminarSemana(semana.id_semana_pedido)
                          }
                          title="Eliminar Semana"
                        >
                          <Box
                            component="img"
                            src="/icons/eliminar.png"
                            alt="Eliminar Semana"
                            sx={{ width: 22, height: 22 }}
                          />
                        </IconButton>
                        <IconButton
                          onClick={() => handleActualizarSemana(semana)}
                          title="Actualizar Semana"
                          ref={(el) =>
                            (actualizarBtnRefs.current[
                              semana.id_semana_pedido
                            ] = el)
                          }
                        >
                          <Box
                            component="img"
                            src="/icons/actualizar.png"
                            alt="Actualizar Semana"
                            sx={{ width: 22, height: 22 }}
                          />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {semana.id_semana_pedido}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {semana.descripcion}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {semana.nombre_escuela}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {semana.fecha_inicio}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {semana.fecha_fin}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {semana.estado}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </CardContent>
      <ModalCrearActualizarSemanaPedido
        open={openModal}
        onClose={handleCloseModal}
        onSemanaActualizada={() =>
          refrescarSemanas(currentPage, filtros.descripcion)
        }
        semana={semanaSeleccionada}
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

export default GestionDeSemanasPedidos;