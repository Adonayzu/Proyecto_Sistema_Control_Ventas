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
  TextField,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerProductos from "../../components/CrudProductos/ObtenerProductos";
import EliminarProducto from "../../components/CrudProductos/EliminarProducto";
import ModalCrearActualizarProducto from "../../components/ModalProducto/ModalCrearActualizarProducto";
import AddIcon from "@mui/icons-material/Add";

const ROW_PER_PAGE = 3;

const GestionDeProductos = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [filtros, setFiltros] = useState({
    nombre_producto: "",
  });
  const agregarBtnRef = useRef(null);

  const cargarProductos = async (page = 1, nombre_producto = "") => {
    try {
      const data = await ObtenerProductos(page, ROW_PER_PAGE, nombre_producto);
      setProductos(data.productos || []);
      setTotalPages(data.pages || 1);

      if (
        (data.productos?.length === 0 || !data.productos) &&
        nombre_producto
      ) {
        setSnackbarMessage(
          `No se encontraron productos con el nombre "${nombre_producto}"`
        );
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch {
      setProductos([]);
      setTotalPages(1);
      setSnackbarMessage("Error al cargar los productos. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    cargarProductos(currentPage, filtros.nombre_producto);
    // eslint-disable-next-line
  }, [currentPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenModal = (producto = null) => {
    setProductoSeleccionado(producto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductoSeleccionado(null);
  };

  const refrescarProductos = async () => {
    cargarProductos(currentPage, filtros.nombre_producto);
  };

  const handleEliminarProducto = async (productoId) => {
    try {
      await EliminarProducto(productoId);
      setSnackbarMessage("Producto eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarProductos();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setSnackbarMessage(error.response.data.msg);
      } else {
        setSnackbarMessage("Error al eliminar el producto.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleModalExited = () => {
    if (agregarBtnRef.current) {
      agregarBtnRef.current.focus();
    }
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    cargarProductos(1, filtros.nombre_producto);
  };

  const cancelarBusqueda = () => {
    setFiltros({ nombre_producto: "" });
    setCurrentPage(1);
    cargarProductos(1, "");
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Box>
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h4" paddingBottom={2} textAlign={"center"} component="h2" sx={{ fontWeight: "bold" }}>
              Buscar Producto por Nombre
            </Typography>
            <Stack spacing={2} direction="row" justifyContent={"center"}>
              <TextField
                label="Nombre del Producto"
                name="nombre_producto"
                value={filtros.nombre_producto || ""}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    nombre_producto: e.target.value,
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
                Listado de Productos
              </Typography>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{ color: "text.secondary" }}
              >
                Productos registrados en el sistema.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              ref={agregarBtnRef}
            >
              Agregar Nuevo Producto
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Acciones</StyledTableCell>
                  <StyledTableCell align="center">Id Producto</StyledTableCell>
                  <StyledTableCell align="center">
                    Nombre Producto
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Precio Unitario
                  </StyledTableCell>
                  <StyledTableCell align="center">Categoría</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={5} align="center">
                      {filtros.nombre_producto
                        ? `No se encontró ningún producto con el nombre "${filtros.nombre_producto}".`
                        : "No hay productos registrados."}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  productos.map((producto) => (
                    <StyledTableRow key={producto.id_producto}>
                      <StyledTableCell>
                        <Stack
                          direction="row"
                          justifyContent={"space-around"}
                          alignItems="center"
                        >
                          <IconButton
                            onClick={() =>
                              handleEliminarProducto(producto.id_producto)
                            }
                          >
                            <Box
                              component="img"
                              src="/icons/eliminar.png"
                              alt="Eliminar Producto"
                              sx={{ width: 20, height: 20 }}
                            />
                          </IconButton>
                          <IconButton onClick={() => handleOpenModal(producto)}>
                            <Box
                              component="img"
                              src="/icons/actualizar_producto.png"
                              alt="Actualizar Producto"
                              sx={{ width: 21, height: 21 }}
                            />
                          </IconButton>
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {producto.id_producto}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {producto.nombre_producto}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Q{producto.precio_venta.toFixed(2)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {producto.nombre_categoria}
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
        </Box>
      </CardContent>

      <ModalCrearActualizarProducto
        open={openModal}
        onClose={handleCloseModal}
        onProductoCreado={refrescarProductos}
        producto={productoSeleccionado}
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

export default GestionDeProductos;
