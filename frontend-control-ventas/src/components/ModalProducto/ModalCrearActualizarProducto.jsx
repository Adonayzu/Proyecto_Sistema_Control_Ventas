import React, { useState, useEffect, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ObtenerCategorias from "../../components/CrudCategorias/ObtenerCategorias";
import CrearProducto from "../CrudProductos/CrearProducto";
import ActualizarProducto from "../CrudProductos/ActualizarProducto";
import Autocomplete from "@mui/material/Autocomplete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 24,
  p: 4,
};

const ModalCrearActualizarProducto = ({
  open,
  onClose,
  onProductoCreado,
  producto
}) => {
  const [formData, setFormData] = useState({
    nombre_producto: "",
    precio_venta: "",
    id_categoria: ""
  });
  const [categorias, setCategorias] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const categoriaRef = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await ObtenerCategorias();
        setCategorias(data);
        
        if (producto) {
          const nuevoFormData = {
            nombre_producto: producto.nombre_producto || "",
            precio_venta:
              producto.precio_venta !== undefined && producto.precio_venta !== null
                ? producto.precio_venta.toString()
                : "",
            id_categoria: producto.id_categoria ? String(producto.id_categoria) : "",
          };
          setFormData(nuevoFormData);
        } else {
          setFormData({
            nombre_producto: "",
            precio_venta: "",
            id_categoria: "",
          });
        }
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    if (open) {
      cargarDatos();
    }
  }, [open, producto]);

  useEffect(() => {
    if (open && categoriaRef.current) {
      categoriaRef.current.focus();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.nombre_producto.trim() ||
        formData.precio_venta === "" ||
        isNaN(Number(formData.precio_venta)) ||
        Number(formData.precio_venta) < 0 ||
        !formData.id_categoria
      ) {
        setSnackbarMessage("Completa todos los campos correctamente.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const productoData = {
        nombre_producto: formData.nombre_producto.trim(),
        precio_venta: Number(formData.precio_venta),
        id_categoria: Number(formData.id_categoria),
      };

      if (producto) {
        productoData.id_producto = producto.id_producto;
        await ActualizarProducto(productoData);
        setSnackbarMessage("El producto fue actualizado correctamente.");
        setSnackbarSeverity("success");
      } else {
        await CrearProducto(productoData);
        setSnackbarMessage("El producto fue creado correctamente.");
        setSnackbarSeverity("success");
      }

      setSnackbarOpen(true);
      onProductoCreado();
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      const errorMessage =
        error.response?.data?.msg || "Ocurrió un error al guardar el producto.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disablePortal={false}
        sx={{ textAlign: "center" }}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box component="form" sx={style} onSubmit={handleSubmit}>
            <Typography variant="h6" component="h2" gutterBottom>
              {producto ? "Actualizar Producto" : "Crear Producto"}
            </Typography>
            <TextField
              required
              id="nombre_producto"
              name="nombre_producto"
              label="Nombre del Producto"
              fullWidth
              margin="normal"
              value={formData.nombre_producto}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              required
              id="precio_venta"
              name="precio_venta"
              label="Precio de Venta"
              type="number"
              fullWidth
              margin="normal"
              value={formData.precio_venta}
              onChange={handleChange}
              slotProps={{
                input: { min: 0, step: "0.01" }
              }}
              autoComplete="off"
            />
            <Autocomplete
              id="categoria"
              options={categorias}
              getOptionLabel={(option) => option.nombre_categoria || ""}
              value={
                categorias.find(
                  (cat) => String(cat.id_categoria) === formData.id_categoria
                ) || null
              }
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  id_categoria: value ? String(value.id_categoria) : "",
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categoría"
                  required
                  fullWidth
                  margin="normal"
                  autoComplete="off"
                  inputRef={categoriaRef}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                String(option.id_categoria) === String(value?.id_categoria)
              }
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Button
                onClick={onClose}
                color="secondary"
                variant="contained"
                sx={{ flex: 1, mr: 1 }}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ flex: 1 }}
              >
                {producto ? "Actualizar Producto" : "Crear Producto"}
              </Button>
            </Box>
          </Box>
        </Fade>
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

export default ModalCrearActualizarProducto;