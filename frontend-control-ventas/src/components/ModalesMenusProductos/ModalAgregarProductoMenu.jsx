import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import AgregarProductoMenu from "../CrudMenusProductos/AgregarProductoMenu";
import ObtenerProductosSinPaginacion from "../CrudProductos/ObtenerProductosSinPaginacion";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #009688",
  boxShadow: 24,
  p: 4,
};

const ModalAgregarProductoMenu = ({
  open,
  onClose,
  onProductoActualizado,
  idMenu,
}) => {
  const [formData, setFormData] = useState({
    nombre_producto: "",
  });
  const [productos, setProductos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await ObtenerProductosSinPaginacion();
        setProductos(Array.isArray(data) ? data : (data.productos || []));
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setProductos([]); 
      }
    };

    if (open) {
      cargarProductos();
      setFormData({
        nombre_producto: "",
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoSeleccionado = productos.find(
        (p) => p.nombre_producto === formData.nombre_producto
      );
      if (!productoSeleccionado) {
        setSnackbarMessage("Selecciona un producto válido.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const response = await AgregarProductoMenu(idMenu, {
        id_producto: productoSeleccionado.id_producto,
      });

      if (response.msg === "Producto agregado al menú exitosamente") {
        setSnackbarMessage(response.msg);
        setSnackbarSeverity("success");
      } else if (response.msg === "Producto reactivado en el menú exitosamente") {
        setSnackbarMessage(response.msg);
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(response.msg || "Error al agregar el producto.");
        setSnackbarSeverity("error");
      }

      setSnackbarOpen(true);
      onProductoActualizado();
      onClose();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409 && data.msg === "El producto ya está asociado a este menú") {
          setSnackbarMessage(data.msg);
          setSnackbarSeverity("warning");
        } else {
          setSnackbarMessage(data.msg || "Error al guardar el producto. Intente nuevamente.");
          setSnackbarSeverity("error");
        }
      } else {
        console.error("Error al guardar el producto:", error);
        setSnackbarMessage("Error al guardar el producto. Intente nuevamente.");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Agregar Producto
          </Typography>
          <Autocomplete
            options={productos}
            getOptionLabel={(option) => option.nombre_producto}
            onChange={(event, value) => {
              setFormData((prevData) => ({
                ...prevData,
                nombre_producto: value?.nombre_producto || "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nombre del Producto"
                required
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained"  color="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Agregar
            </Button>
          </Box>
        </Box>
      </Modal>

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
    </>
  );
};

export default ModalAgregarProductoMenu;