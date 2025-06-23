import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Fade,
  Backdrop
} from "@mui/material";
import ObtenerEscuelas from "../CrudEscuelas/ObtenerEscuelas";
import CrearSemanaPedido from "../CrudSemanaPedidos/CrearSemanaPedido";
import ActualizarSemanaPedido from "../CrudSemanaPedidos/ActualizarSemanaPedido";
import Autocomplete from "@mui/material/Autocomplete";

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

const ModalCrearActualizarSemanaPedido = ({
  open,
  onClose,
  onSemanaActualizada,
  semana,
}) => {
  const [formData, setFormData] = useState({
    id_escuela: "",
    fecha_inicio: "",
    fecha_fin: "",
    descripcion: "",
    estado: "abierto",
  });
  const [escuelas, setEscuelas] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const escuelaRef = useRef(null);

  useEffect(() => {
    const cargarEscuelas = async () => {
      setEscuelas(await ObtenerEscuelas());
    };
    cargarEscuelas();
    if (semana) {
      setFormData({
        id_escuela: semana.id_escuela ? String(semana.id_escuela) : "",
        fecha_inicio: semana.fecha_inicio,
        fecha_fin: semana.fecha_fin,
        descripcion: semana.descripcion,
        estado: semana.estado,
      });
    } else {
      setFormData({
        id_escuela: "",
        fecha_inicio: "",
        fecha_fin: "",
        descripcion: "",
        estado: "abierto",
      });
    }
  }, [open, semana]);

  useEffect(() => {
    if (open && escuelaRef.current) {
      escuelaRef.current.focus();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (semana) {
        await ActualizarSemanaPedido({
          ...formData,
          id_semana_pedido: semana.id_semana_pedido,
        });
        setSnackbar({
          open: true,
          message: "Semana actualizada correctamente",
          severity: "success",
        });
      } else {
        await CrearSemanaPedido(formData);
        setSnackbar({
          open: true,
          message: "Semana creada correctamente",
          severity: "success",
        });
      }
      onClose();
      if (onSemanaActualizada) onSemanaActualizada();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.msg || "Error al guardar la semana",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

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
              {semana ? "Actualizar Semana" : "Crear Semana"}
            </Typography>
            <Autocomplete
              options={escuelas}
              getOptionLabel={(option) => option.nombre_escuela || ""}
              value={
                escuelas.find(
                  (esc) => String(esc.id_escuela) === formData.id_escuela
                ) || null
              }
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  id_escuela: newValue ? String(newValue.id_escuela) : "",
                }));
              }}
              isOptionEqualToValue={(option, value) =>
                String(option.id_escuela) === String(value.id_escuela)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Escuela"
                  margin="normal"
                  required
                  fullWidth
                  inputRef={escuelaRef}
                />
              )}
            />
            <TextField
              label="Fecha Inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Fecha Fin"
              name="fecha_fin"
              type="date"
              value={formData.fecha_fin}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Autocomplete
              id="estado"
              options={[
                { label: "Abierto", value: "abierto" },
                { label: "Cerrado", value: "cerrado" },
              ]}
              getOptionLabel={(option) => option.label}
              value={
                [
                  { label: "Abierto", value: "abierto" },
                  { label: "Cerrado", value: "cerrado" },
                ].find((opt) => opt.value === formData.estado) || null
              }
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  estado: value ? value.value : "",
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estado"
                  required
                  fullWidth
                  margin="normal"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
            />
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
                {semana ? "Actualizar Semana" : "Crear Semana"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
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
    </>
  );
};

export default ModalCrearActualizarSemanaPedido;
