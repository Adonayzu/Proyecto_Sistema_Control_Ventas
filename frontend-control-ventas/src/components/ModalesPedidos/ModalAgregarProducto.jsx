import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import AgregarProductoPedido from "../CrudPedidos/CrudPedidoProducto/AgregarProductoPedido";
import ObtenerProductosSinPaginacion from "../CrudProductos/ObtenerProductosSinPaginacion";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ModalAgregarProducto = ({
  open,
  onClose,
  id_pedido,
  onProductoAgregado,
  onError, 
}) => {
  const [form, setForm] = useState({
    id_producto: "",
    cantidad: 0,
    precio_unitario: "",
    es_extra: false,
  });
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await ObtenerProductosSinPaginacion();
        setProductos(Array.isArray(data?.productos) ? data.productos : []);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      }
    };
    if (open) fetchProductos();
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AgregarProductoPedido(id_pedido, form);
      if (onProductoAgregado) onProductoAgregado();
      if (onClose) onClose();
      setForm({
        id_producto: "",
        cantidad: 0,
        precio_unitario: "",
        es_extra: false,
      });
    } catch (error) {
      let msg = "Error al agregar el producto";
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      }
      if (onError) onError(msg);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" textAlign={"center"} mb={2}>
          Agregar Producto Extra
        </Typography>
        <Autocomplete
          options={Array.isArray(productos) ? productos : []}
          getOptionLabel={(option) => option?.nombre_producto || ""}
          onChange={(event, value) => {
            setForm((prev) => ({
              ...prev,
              id_producto: value ? value.id_producto : "",
              precio_unitario: value
                ? value.precio_unitario ??
                  value.precio ??
                  value.precio_venta ??
                  ""
                : "",
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nombre del Producto"
              required
              fullWidth
              margin="normal"
            />
          )}
        />
        <TextField
          label="Precio Unitario"
          name="precio_unitario"
          type="number"
          value={form.precio_unitario}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Cantidad"
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            color="secondary"
            variant="contained"
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Agregar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAgregarProducto;
