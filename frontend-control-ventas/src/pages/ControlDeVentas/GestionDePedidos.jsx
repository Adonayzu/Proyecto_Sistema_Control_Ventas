import React, { useState, useEffect, useCallback } from "react";
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
  Collapse,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerPedidosProductosRecientes from "../../components/CrudPedidos/CrudPedidos/ObtenerPedidosProductosRecientes";
import EliminarPedidoProductos from "../../components/CrudPedidos/CrudPedidos/EliminarPedidoProductos";
import ModalCrearActualizarPedido from "../../components/ModalesPedidos/ModalCrearActualizarPedido";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ProductosDePedidoEditable from "../../components/CrudPedidos/CrudPedidoProducto/ProductosDePedidoEditable";

const ROWS_PER_PAGE = 15;

const GestionDePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [filtros, setFiltros] = useState({ descripcion_semana: "" });

  const [expandedRows, setExpandedRows] = useState({});

  const [refreshKey, setRefreshKey] = useState(0);

  const location = useLocation();

  const refrescarPedidos = useCallback(
    async (
      page = currentPage,
      descripcion_semana = filtros.descripcion_semana,
      id_semana_pedido = filtros.id_semana_pedido
    ) => {
      try {
        const data = await ObtenerPedidosProductosRecientes(
          page,
          ROWS_PER_PAGE,
          descripcion_semana || null,
          id_semana_pedido
        );
        setPedidos(data.pedidos || []);
        setTotalPages(data.pages || 1);
      } catch {
        setPedidos([]);
        setTotalPages(1);
        setSnackbarMessage("Error al obtener los pedidos.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
    [currentPage, filtros.descripcion_semana, filtros.id_semana_pedido]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const semanaId = params.get("semana");
    const descSemana = params.get("desc") || "";
    const idEscuela = params.get("escuela") || "";
    if (semanaId) {
      setFiltros((prev) => ({
        ...prev,
        id_semana_pedido: semanaId,
        descripcion_semana: descSemana,
        id_escuela: idEscuela,
      }));
      setCurrentPage(1);
      refrescarPedidos(1, descSemana, semanaId);
    } else {
      refrescarPedidos(currentPage, filtros.descripcion_semana);
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    refrescarPedidos(newPage, filtros.descripcion_semana, filtros.id_semana_pedido);
  };

  const handleOpenModal = (pedido = null) => {
    setPedidoSeleccionado(pedido);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPedidoSeleccionado(null);
  };

  const handleEliminarPedido = async (idPedido) => {
    try {
      await EliminarPedidoProductos(idPedido);
      setSnackbarMessage("Pedido eliminado con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        refrescarPedidos(
          currentPage,
          filtros.descripcion_semana,
          filtros.id_semana_pedido
        );
        setRefreshKey((k) => k + 1);
      }, 300);
    } catch {
      setSnackbarMessage("Error al eliminar el pedido. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleExpandRow = (id_pedido) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id_pedido]: !prev[id_pedido],
    }));
  };

  const handleActualizarTotalesSemana = () => {
    refrescarPedidos(currentPage, filtros.descripcion_semana, filtros.id_semana_pedido);
    setRefreshKey((k) => k + 1); 
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}
        >
          Gestión de Pedidos
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
            to="/semanapedidos"
          >
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
              Listado de Pedidos
            </Typography>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              Pedidos registrados en el sistema.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ backgroundColor: "#009688" }}
          >
            Crear Nuevo Pedido
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">Escuela</StyledTableCell>
                <StyledTableCell align="center">Número Menú</StyledTableCell>
                <StyledTableCell align="center">Tipo Menú</StyledTableCell>
                <StyledTableCell align="center">
                  Nivel Educativo
                </StyledTableCell>
                <StyledTableCell align="center">Fecha</StyledTableCell>
                <StyledTableCell align="center">Día</StyledTableCell>
                <StyledTableCell align="center">
                  Semana del Pedido
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={9} align="center">
                    No hay pedidos registrados para la semana buscada.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                pedidos.map((pedido, index) => (
                  <React.Fragment key={pedido.id_pedido || `row-${index}`}>
                    <StyledTableRow>
                      <StyledTableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandRow(pedido.id_pedido)}
                          aria-label={
                            expandedRows[pedido.id_pedido]
                              ? "Ocultar productos"
                              : "Ver productos"
                          }
                        >
                          {expandedRows[pedido.id_pedido] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent={"space-around"}
                          alignItems="center"
                        >
                          <IconButton
                            onClick={() =>
                              handleEliminarPedido(pedido.id_pedido)
                            }
                          >
                            <Box
                              component="img"
                              src="/icons/eliminar.png"
                              alt="Eliminar Pedido"
                              sx={{ width: 22, height: 22 }}
                            />
                          </IconButton>
                          <IconButton onClick={() => handleOpenModal(pedido)}>
                            <Box
                              component="img"
                              src="/icons/actualizar.png"
                              alt="Actualizar Pedido"
                              sx={{ width: 22, height: 22 }}
                            />
                          </IconButton>
                        </Stack>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {pedido.escuela}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pedido.menu_escolar?.numero_menu || ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pedido.menu_escolar?.tipo_menu || ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pedido.menu_escolar?.nivel_educativo || ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pedido.fecha_pedido}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pedido.dia_semana}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pedido.semana_pedido}
                      </StyledTableCell>
                    </StyledTableRow>
                    <TableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={9}
                      >
                        <Collapse
                          in={expandedRows[pedido.id_pedido]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 2 }}>
                            <ProductosDePedidoEditable
                              key={pedido.id_pedido + '-' + refreshKey}
                              id_pedido={pedido.id_pedido}
                              id_semana_pedido={pedido.id_semana_pedido}
                              id_escuela={pedido.id_escuela}
                              onActualizarTotalesSemana={handleActualizarTotalesSemana}
                            />
                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </TableRow>
                  </React.Fragment>
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
      <ModalCrearActualizarPedido
        open={openModal}
        onClose={handleCloseModal}
        onPedidoCreado={() => {
          refrescarPedidos(
            currentPage,
            filtros.descripcion_semana,
            filtros.id_semana_pedido
          );
          setRefreshKey((k) => k + 1);
        }}
        pedido={pedidoSeleccionado}
        idSemanaPorDefecto={filtros.id_semana_pedido || null}
        idEscuelaPorDefecto={filtros.id_escuela || null}
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

export default GestionDePedidos;