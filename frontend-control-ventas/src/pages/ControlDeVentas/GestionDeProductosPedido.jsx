import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ObtenerProductosDePedido from "../../components/CrudPedidos/CrudPedidoProducto/ObtenerProductosDePedido";
import eliminarProductoDePedido from "../../components/CrudPedidos/CrudPedidoProducto/EliminarProductoPedido";
import ActualizarProductoPedido from "../../components/CrudPedidos/CrudPedidoProducto/ActualizarProductoPedido";
import ModalAgregarProducto from "../../components/ModalesPedidos/ModalAgregarProducto";
import ModalActualizarProducto from "../../components/ModalesPedidos/ModalActualizarProducto";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";

const GestionDeProductosPedido = () => {
  const { id_pedido } = useParams();
  const [productos, setProductos] = useState([]);
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openActualizar, setOpenActualizar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [subtotalesCategoria, setSubtotalesCategoria] = useState({});
  const [totalVenta, setTotalVenta] = useState(0);

  const [filtros, setFiltros] = useState({
    nombre_producto: "",
  });

  const fetchProductos = async (nombre_producto = "") => {
    try {
      const data = await ObtenerProductosDePedido(id_pedido, nombre_producto);
      setProductos(Array.isArray(data) ? data : data.productos || []);
      setSubtotalesCategoria(data.subtotales_categoria || {});
      setTotalVenta(data.total_venta || 0);

      if (
        (data.productos?.length === 0 || !data.productos) &&
        nombre_producto
      ) {
        setSnackbar({
          open: true,
          message: `No se encontraron productos con el nombre "${nombre_producto}"`,
          severity: "warning",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al obtener productos: " + error.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line
  }, [id_pedido]);

  const handleBuscar = () => {
    fetchProductos(filtros.nombre_producto);
  };

  const cancelarBusqueda = () => {
    setFiltros({ nombre_producto: "" });
    fetchProductos("");
  };

  const handleEliminar = async (id_pedido_producto) => {
    try {
      await eliminarProductoDePedido(id_pedido_producto);
      setSnackbar({
        open: true,
        message: "Producto eliminado",
        severity: "success",
      });
      fetchProductos(filtros.nombre_producto);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar producto",
        severity: "error",
      });
    }
  };

  const handleProductoActualizado = () => {
    setSnackbar({
      open: true,
      message: "Producto actualizado",
      severity: "success",
    });
    fetchProductos(filtros.nombre_producto);
    setOpenActualizar(false);
  };

  const handleOpenActualizar = (producto) => {
    setProductoSeleccionado(producto);
    setOpenActualizar(true);
  };

  const handleCantidadChange = (prod, value) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id_pedido_producto === prod.id_pedido_producto
          ? { ...p, cantidad: value }
          : p
      )
    );
  };

  const handleCantidadBlur = async (prod, value) => {
    const cantidadFinal = value === "" ? 0 : Number(value);
    if (cantidadFinal !== Number(prod.cantidad)) {
      try {
        await ActualizarProductoPedido({
          id_pedido_producto: prod.id_pedido_producto,
          cantidad: cantidadFinal,
          precio_unitario: prod.precio_unitario,
          es_extra: prod.es_extra,
        });
        setSnackbar({
          open: true,
          message: "Cantidad actualizada",
          severity: "success",
        });
        fetchProductos(filtros.nombre_producto);
      } catch {
        setSnackbar({
          open: true,
          message: "Error al actualizar cantidad",
          severity: "error",
        });
      }
    }
  };

  const handleGuardarTodasCantidades = async () => {
    try {
      await Promise.all(
        productos.map((prod) =>
          ActualizarProductoPedido({
            id_pedido_producto: prod.id_pedido_producto,
            cantidad: Number(prod.cantidad) || 0,
            precio_unitario: prod.precio_unitario,
            es_extra: prod.es_extra,
          })
        )
      );
      setSnackbar({
        open: true,
        message: "Todas las cantidades actualizadas",
        severity: "success",
      });
      fetchProductos(filtros.nombre_producto);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al actualizar cantidades",
        severity: "error",
      });
    }
  };

  const handleAgregarProductoError = (msg) => {
    setSnackbar({
      open: true,
      message: msg,
      severity: "error",
    });
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Gestión de Productos del Pedido #{id_pedido}
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h5"
          paddingBottom={2}
          component="h2"
          sx={{ fontWeight: "bold" }}
        >
          Buscar Producto por Nombre
        </Typography>
        <Stack spacing={2} direction="row">
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

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ marginBottom: 2 }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#009688", ml: 5 }}
          component={Link}
          to="/pedidos"
        >
          Regresar a Gestión de Pedidos
        </Button>
      </Stack>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#009688", mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setOpenAgregar(true)}
      >
        Agregar Producto Extra
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGuardarTodasCantidades}
        sx={{ mb: 2, ml: 2 }}
      >
        Guardar Cambios en Cantidades
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Producto</StyledTableCell>
              <StyledTableCell align="center">Categoría</StyledTableCell>
              <StyledTableCell align="center">Cantidad</StyledTableCell>
              <StyledTableCell align="center">Precio Unitario</StyledTableCell>
              <StyledTableCell align="center">Subtotal Venta</StyledTableCell>
              <StyledTableCell align="center">¿Es Extra?</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <StyledTableRow key={prod.id_pedido_producto}>
                <StyledTableCell align="center">
                  {prod.nombre_producto}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {prod.nombre_categoria}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    value={
                      prod.cantidad === undefined || prod.cantidad === null
                        ? ""
                        : prod.cantidad
                    }
                    slotProps={{
                      input: {
                        min: 0,
                        style: { textAlign: "center", width: 60 },
                      },
                    }}
                    onChange={(e) => handleCantidadChange(prod, e.target.value)}
                    onBlur={(e) => handleCantidadBlur(prod, e.target.value)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  Q{prod.precio_unitario.toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  Q{prod.subtotal.toFixed(2)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {prod.es_extra ? "Sí" : "No"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton onClick={() => handleOpenActualizar(prod)}>
                    <Box
                      component="img"
                      src="/icons/actualizar_precio.png"
                      alt="Actualizar Pedido"
                      sx={{ width: 25, height: 25 }}
                    />
                  </IconButton>

                  <IconButton
                    onClick={() => handleEliminar(prod.id_pedido_producto)}
                  >
                    <Box
                      component="img"
                      src="/icons/eliminar.png"
                      alt="Eliminar Pedido"
                      sx={{ width: 22, height: 22 }}
                    />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {productos.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No hay productos asignados a este pedido.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack sx={{ mt: 4, mb: 4 }} direction="row" justifyContent="flex-end">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Subtotales por Categoría
          </Typography>
          {subtotalesCategoria &&
          Object.keys(subtotalesCategoria).length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Categoría</StyledTableCell>
                    <StyledTableCell align="center">Subtotal</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(subtotalesCategoria).map(
                    ([categoria, subtotal]) => (
                      <StyledTableRow key={categoria}>
                        <StyledTableCell align="center">
                          {categoria}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Q{subtotal.toFixed(2)}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                  <StyledTableRow>
                    <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                      Total Pedido
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                      Q{totalVenta.toFixed(2)}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay subtotales por categoría.
            </Typography>
          )}
        </Box>
      </Stack>

      <ModalAgregarProducto
        open={openAgregar}
        onClose={() => setOpenAgregar(false)}
        id_pedido={id_pedido}
        onProductoAgregado={() => fetchProductos(filtros.nombre_producto)}
        onError={handleAgregarProductoError}
      />

      <ModalActualizarProducto
        open={openActualizar}
        onClose={() => setOpenActualizar(false)}
        producto={productoSeleccionado}
        onProductoActualizado={handleProductoActualizado}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionDeProductosPedido;
