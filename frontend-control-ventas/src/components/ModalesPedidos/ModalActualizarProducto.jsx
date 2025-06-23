import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ActualizarProductoPedido from "../CrudPedidos/CrudPedidoProducto/ActualizarProductoPedido";

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

const ModalActualizarProducto = ({ open, onClose, producto, onProductoActualizado }) => {
  const [form, setForm] = useState({
    cantidad: 1,
    precio_unitario: "",
    es_extra: false,
  });

  useEffect(() => {
    if (producto) {
      setForm({
        cantidad: producto.cantidad,
        precio_unitario: producto.precio_unitario,
        es_extra: producto.es_extra,
      });
    }
  }, [producto]);

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
        await ActualizarProductoPedido({
        id_pedido_producto: producto.id_pedido_producto,
        cantidad: producto.cantidad, 
        precio_unitario: form.precio_unitario,
        es_extra: form.es_extra,
        });
        onProductoActualizado();
        onClose();
    } catch {
        console.error("Error al actualizar el producto del pedido");
        
    }
    };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2} textAlign={"center"}>Actualizar Precio del Producto</Typography>

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

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} sx={{ mr: 1 }} variant="contained" color="secondary">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Actualizar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalActualizarProducto;