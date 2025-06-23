import React, { useEffect, useState } from "react";
import {
  Box,
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
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ObtenerProductosDePedido from "./ObtenerProductosDePedido";
import eliminarProductoDePedido from "./EliminarProductoPedido";
import ActualizarProductoPedido from "./ActualizarProductoPedido";
import ModalAgregarProducto from "../../ModalesPedidos/ModalAgregarProducto";
import ModalActualizarProducto from "../../ModalesPedidos/ModalActualizarProducto";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../EstilosTablas/StyledTableCell";
import ObtenerTotalSemanaPedidos from "../../CrudSemanaPedidos/ObtenerTotalSemanaPedidos";

const ProductosDePedidoEditable = ({
  id_pedido,
  id_semana_pedido,
  id_escuela,
  soloLectura = false,
  onActualizarTotalesSemana, 
}) => {
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


  const [totalSemana, setTotalSemana] = useState(0);


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


  const fetchTotalSemana = async () => {
    if (id_semana_pedido && id_escuela) {
      try {
        const total = await ObtenerTotalSemanaPedidos(id_semana_pedido, id_escuela);
        setTotalSemana(total);
      } catch  {
        setTotalSemana(0);
      }
    }
  };

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line
  }, [id_pedido]);

  useEffect(() => {
    fetchTotalSemana();
    // eslint-disable-next-line
  }, [id_semana_pedido, id_escuela, productos]);

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
      if (onActualizarTotalesSemana) onActualizarTotalesSemana(); 
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
    if (onActualizarTotalesSemana) onActualizarTotalesSemana(); 
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
        if (onActualizarTotalesSemana) onActualizarTotalesSemana();
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
      if (onActualizarTotalesSemana) onActualizarTotalesSemana(); 
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
    <Box sx={{ m: 1 }}>
      {!soloLectura && (
        <Box sx={{ marginBottom: 2 }}>
          <Stack spacing={2} direction="row" justifyContent="center">
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
      )}

      {!soloLectura && (
        <>
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
        </>
      )}

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
              {!soloLectura && (
                <StyledTableCell align="center">Acciones</StyledTableCell>
              )}
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
                  {soloLectura ? (
                    prod.cantidad
                  ) : (
                    <TextField
                      type="number"
                      size="small"
                      value={
                        prod.cantidad === undefined || prod.cantidad === null
                          ? ""
                          : prod.cantidad
                      }
                      slotProps={{
                        min: 0,
                        style: { textAlign: "center", width: 60 },
                      }}
                      onChange={(e) => handleCantidadChange(prod, e.target.value)}
                      onBlur={(e) => handleCantidadBlur(prod, e.target.value)}
                    />
                  )}
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
                {!soloLectura && (
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
                )}
              </StyledTableRow>
            ))}
            {productos.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={soloLectura ? 6 : 7} align="center">
                  No hay productos asignados a este pedido.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack sx={{ mt: 2, mb: 2 }} direction="row" justifyContent="flex-end">
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Subtotales por Categoría
          </Typography>
          {subtotalesCategoria && Object.keys(subtotalesCategoria).length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
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
                        <StyledTableCell align="center">{categoria}</StyledTableCell>
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

      {id_semana_pedido && id_escuela && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
            <Table>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#1976d2" }}
                  >
                    Total de la Semana
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#1976d2" }}
                  >
                    Q{totalSemana.toFixed(2)}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {!soloLectura && (
        <>
          <ModalAgregarProducto
            open={openAgregar}
            onClose={() => setOpenAgregar(false)}
            id_pedido={id_pedido}
            onProductoAgregado={() => {
              fetchProductos(filtros.nombre_producto);
              if (onActualizarTotalesSemana) onActualizarTotalesSemana(); 
            }}
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
        </>
      )}
    </Box>
  );
};

export default ProductosDePedidoEditable;