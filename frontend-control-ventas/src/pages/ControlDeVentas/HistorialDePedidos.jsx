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
  Pagination,
  Box,
  Button,
  Stack,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerHistorialPedidos from "../../components/CrudPedidos/ObtenerHistorialPedidos";
import ProductosDePedidoEditable from "../../components/CrudPedidos/CrudPedidoProducto/ProductosDePedidoEditable";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ROWS_PER_PAGE = 20;

const HistorialDePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [expandedRows, setExpandedRows] = useState({});
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const semanaId = params.get("semana");
    fetchHistorial(currentPage, semanaId);
  }, [currentPage, location.search]);

  const fetchHistorial = async (page = 1, id_semana_pedido = null) => {
    try {
      const data = await ObtenerHistorialPedidos(
        page,
        ROWS_PER_PAGE,
        null,
        id_semana_pedido
      );
      setPedidos(data.pedidos || []);
      setTotalPages(data.pages || 1);
      setExpandedRows({});
      if (!data.pedidos || data.pedidos.length === 0) {
        setSnackbar({
          open: true,
          message: "No hay pedidos históricos para la semana seleccionada.",
          severity: "warning",
        });
      }
    } catch {
      setPedidos([]);
      setTotalPages(1);
      setSnackbar({
        open: true,
        message: "Error al obtener el historial de pedidos.",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleExpandRow = (id_pedido) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id_pedido]: !prev[id_pedido],
    }));
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/historialsemanaspedidos"
            sx={{ ml: 2 }}
          >
            Regresar a Historial de Semanas de Pedidos
          </Button>
        </Stack>

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}
        >
          Historial de Pedidos
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell />
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
                  <StyledTableCell colSpan={8} align="center">
                    No hay pedidos históricos para la semana seleccionada.
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
                        colSpan={8}
                      >
                        <Collapse
                          in={expandedRows[pedido.id_pedido]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 2 }}>
                            <ProductosDePedidoEditable
                              id_pedido={pedido.id_pedido}
                              id_semana_pedido={pedido.id_semana_pedido}
                              id_escuela={pedido.id_escuela}
                              soloLectura={true}
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

export default HistorialDePedidos;