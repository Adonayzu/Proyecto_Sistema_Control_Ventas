import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Box,
  Pagination,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerHistorialSemanasPedidos from "../../components/CrudSemanaPedidos/ObtenerHistorialSemanaPedidos";
import ReabrirSemanaPedidos from "../../components/CrudSemanaPedidos/ReabrirSemanaPedidos";
import { Link, useNavigate } from "react-router-dom";

const ROWS_PER_PAGE = 20;

const HistorialDeSemanasPedidos = () => {
  const [semanas, setSemanas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({ descripcion: "" });

  const navigate = useNavigate();

  const fetchHistorial = async (page = 1, descripcion = "") => {
    try {
      setLoading(true);
      const data = await ObtenerHistorialSemanasPedidos(
        page,
        ROWS_PER_PAGE,
        descripcion || null
      );
      setSemanas(data.semanas || []);
      setTotalPages(data.pages || 1);
    } catch {
      setSemanas([]);
      setTotalPages(1);
      setSnackbar({
        open: true,
        message: "Error al obtener el historial de semanas.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial(currentPage, filtros.descripcion);
    // eslint-disable-next-line
  }, [currentPage]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleChangePage = (event, newPage) => setCurrentPage(newPage);

  const handleBuscar = () => {
    setCurrentPage(1);
    fetchHistorial(1, filtros.descripcion);
  };

  const cancelarBusqueda = () => {
    setFiltros({ descripcion: "" });
    setCurrentPage(1);
    fetchHistorial(1, "");
  };

  const handleReabrir = async (id_semana_pedido) => {
    try {
      setLoading(true);
      await ReabrirSemanaPedidos(id_semana_pedido);
      setSnackbar({
        open: true,
        message: "Semana y pedidos reabiertos exitosamente.",
        severity: "success",
      });
      fetchHistorial(currentPage, filtros.descripcion);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al reabrir la semana y sus pedidos.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerInforme = (semana) => {
    navigate(
      `/informesemanapedidos/${semana.id_semana_pedido}/${semana.id_escuela}?from=historial`
    );
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}
        >
          Historial de Semanas de Pedidos
        </Typography>
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
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">ID</StyledTableCell>
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
                    No hay semanas históricas.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                semanas.map((semana) => (
                  <StyledTableRow key={semana.id_semana_pedido}>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        component={Link}
                        to={`/historialpedidos?semana=${
                          semana.id_semana_pedido
                        }&desc=${encodeURIComponent(semana.descripcion)}`}
                      >
                        Ver Pedidos
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleVerInforme(semana)}
                        sx={{ backgroundColor: "#009688", ml: 1 }}
                      >
                        Ver Informe
                      </Button>
                      {semana.estado === "cerrado" && (
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ ml: 1 }}
                          size="small"
                          disabled={loading}
                          onClick={() => handleReabrir(semana.id_semana_pedido)}
                        >
                          Reabrir
                        </Button>
                      )}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default HistorialDeSemanasPedidos;