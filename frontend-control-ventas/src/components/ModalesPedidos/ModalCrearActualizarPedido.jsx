import React, { useState, useEffect } from "react";
import {
  Box, Modal, Fade, Backdrop, Typography, TextField, Button,
  Snackbar, Alert, Autocomplete
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CrearPedido from "../CrudPedidos/CrudPedidos/CrearPedido";
import ActualizarPedido from "../CrudPedidos/CrudPedidos/ActualizarPedido";
import ObtenerEscuelas from "../CrudEscuelas/ObtenerEscuelas";
import ObtenerMenusProductos from "../CrudMenusProductos/ObtenerMenusProductos";
import ObtenerSemanaPedidos from "../CrudSemanaPedidos/ObtenerSemanaPedidos";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #1976d2",
  boxShadow: 24,
  p: 3,
};

const ModalCrearActualizarPedido = ({
  open,
  onClose,
  onPedidoCreado,
  pedido,
  idSemanaPorDefecto,
  idEscuelaPorDefecto,
}) => {
  const [formData, setFormData] = useState({
    id_escuela: "",
    id_usuario: "",
    id_menu_escolar: "",
    fecha_pedido: "",
    productos: [],
    id_semana_pedido: "",
  });
  const [escuelas, setEscuelas] = useState([]);
  const [menus, setMenus] = useState([]);
  const [semanas, setSemanas] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (!open) return;

    const cargarTodo = async () => {
      const [escuelasData, menusData, semanasData] = await Promise.all([
        ObtenerEscuelas(),
        ObtenerMenusProductos(),
        ObtenerSemanaPedidos(1, 20, null, idEscuelaPorDefecto),
      ]);
      const menusList = Array.isArray(menusData)
        ? menusData
        : Array.isArray(menusData.menus)
        ? menusData.menus
        : [];

      let escuelasFiltradas = escuelasData;
      if (idEscuelaPorDefecto) {
        escuelasFiltradas = escuelasData.filter(
          (e) => String(e.id_escuela) === String(idEscuelaPorDefecto)
        );
      }
      setEscuelas(escuelasFiltradas || []);
      setMenus(menusList);

      let semanasFiltradas = Array.isArray(semanasData.semanas) ? semanasData.semanas : [];
      if (idSemanaPorDefecto) {
        semanasFiltradas = semanasFiltradas.filter(
          (s) => String(s.id_semana_pedido) === String(idSemanaPorDefecto)
        );
      }
      setSemanas(semanasFiltradas);

      if (pedido) {
        setFormData({
          id_escuela: pedido.id_escuela ?? "",
          id_usuario: sessionStorage.getItem("id_usuario") || "",
          id_menu_escolar: pedido.id_menu_escolar ?? "",
          fecha_pedido: pedido.fecha_pedido ?? "",
          productos: pedido.productos ?? [],
          id_semana_pedido: pedido.id_semana_pedido ?? "",
        });
      } else {
        setFormData({
          id_escuela: idEscuelaPorDefecto || "",
          id_usuario: sessionStorage.getItem("id_usuario") || "",
          id_menu_escolar: "",
          fecha_pedido: "",
          productos: [],
          id_semana_pedido: idSemanaPorDefecto || "",
        });
      }
    };

    cargarTodo();
  }, [open, pedido, idSemanaPorDefecto, idEscuelaPorDefecto]);

  const handleMenuChange = (event, value) => {
    const id_menu_escolar = value ? value.id_menu_escolar : "";
    if (!pedido) {
      const menuSeleccionado = menus.find(
        (menu) => Number(menu.id_menu_escolar) === Number(id_menu_escolar)
      );
      const productosMenu = menuSeleccionado
        ? menuSeleccionado.productos.map((prod) => ({
            id_producto: prod.id_producto,
            cantidad: 0,
            precio_unitario: prod.precio_venta,
            es_extra: false,
          }))
        : [];
      setFormData((prev) => ({
        ...prev,
        id_menu_escolar,
        productos: productosMenu,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        id_menu_escolar,
      }));
    }
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      fecha_pedido: newValue ? newValue.format("YYYY-MM-DD") : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_usuario = Number(sessionStorage.getItem("id_usuario"));
    if (!id_usuario) {
      setSnackbarMessage("No se encontró el usuario. Vuelve a iniciar sesión.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    let dataToSend = { ...formData, id_usuario };
    if (pedido && pedido.id_pedido) {
      dataToSend.id_pedido = pedido.id_pedido;
    }
    try {
      if (pedido) {
        await ActualizarPedido(dataToSend);
        setSnackbarMessage("Pedido actualizado correctamente");
      } else {
        await CrearPedido(dataToSend);
        setSnackbarMessage("Pedido creado correctamente");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
      setFormData({
        id_escuela: "",
        id_usuario: "",
        id_menu_escolar: "",
        fecha_pedido: "",
        productos: [],
        id_semana_pedido: "",
      });
      if (onPedidoCreado) onPedidoCreado();
    } catch (error) {
      const backendMsg = error?.response?.data?.msg;
      setSnackbarMessage(backendMsg || "Error al guardar el pedido");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const semanasArray = Array.isArray(semanas) ? semanas : [];
  const semanaSeleccionada = semanasArray.find(
    (s) => String(s.id_semana_pedido) === String(formData.id_semana_pedido)
  );
  const minFecha = semanaSeleccionada
    ? dayjs(semanaSeleccionada.fecha_inicio)
    : null;
  const maxFecha = semanaSeleccionada
    ? dayjs(semanaSeleccionada.fecha_fin)
    : null;

  const menusArray = Array.isArray(menus) ? menus : [];
  const menusOrdenados = [...menusArray].sort((a, b) =>
    (a.nombre_menu || "").localeCompare(b.nombre_menu || "")
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        disablePortal={false}
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box component="form" sx={style} onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              {pedido ? "Actualizar Pedido" : "Crear Pedido"}
            </Typography>
            <Autocomplete
              options={escuelas}
              getOptionLabel={(option) => option.nombre_escuela || ""}
              value={
                escuelas.find((e) => String(e.id_escuela) === String(formData.id_escuela)) ||
                null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Escuela"
                  margin="normal"
                  required
                />
              )}
              isOptionEqualToValue={(option, value) =>
                String(option.id_escuela) === String(value.id_escuela)
              }
              disabled={!!idEscuelaPorDefecto}
            />
            <Autocomplete
              options={semanas}
              getOptionLabel={(option) =>
                option.descripcion
                  ? `${option.descripcion} (${option.fecha_inicio} a ${option.fecha_fin})`
                  : ""
              }
              value={
                semanas.find(
                  (s) => String(s.id_semana_pedido) === String(formData.id_semana_pedido)
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Semana de Pedido"
                  margin="normal"
                  required
                />
              )}
              isOptionEqualToValue={(option, value) =>
                String(option.id_semana_pedido) === String(value.id_semana_pedido)
              }
              disabled={!!idSemanaPorDefecto}
              noOptionsText="No hay semanas disponibles"
            />
            <Autocomplete
              options={menusOrdenados}
              getOptionLabel={(option) =>
                option
                  ? `#${option.numero_menu} - ${option.tipo_menu} - ${option.nivel_educativo}`
                  : ""
              }
              value={
                menusArray.find(
                  (m) => String(m.id_menu_escolar) === String(formData.id_menu_escolar)
                ) || null
              }
              onChange={handleMenuChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Menú Escolar"
                  margin="normal"
                  required
                />
              )}
              isOptionEqualToValue={(option, value) =>
                String(option.id_menu_escolar) === String(value.id_menu_escolar)
              }
              renderOption={(props, option) => (
                <li {...props} key={option.id_menu_escolar}>
                  #{option.numero_menu} - {option.tipo_menu} -{" "}
                  {option.nivel_educativo}
                </li>
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha del Pedido"
                value={formData.fecha_pedido ? dayjs(formData.fecha_pedido) : null}
                onChange={handleDateChange}
                minDate={minFecha}
                maxDate={maxFecha}
                disabled={!semanaSeleccionada}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    required: true,
                    name: "fecha_pedido",
                  },
                }}
              />
            </LocalizationProvider>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{ flex: 1, mr: 1 }}
                type="button"
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ flex: 1 }}
              >
                {pedido ? "Actualizar Pedido" : "Crear Pedido"}
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

export default ModalCrearActualizarPedido;