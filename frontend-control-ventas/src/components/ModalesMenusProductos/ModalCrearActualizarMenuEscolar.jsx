import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CrearMenuEscolar from "../CrudMenusProductos/CrearMenuEscolar";
import ActualizarMenuEscolar from "../CrudMenusProductos/ActualizarMenuEscolar";
import ObtenerTiposMenus from "../CrudTiposMenus/ObtenerTiposMenus";
import ObtenerNivelesEducativos from "../CrudNivelEducativo/ObtenerNivelesEducativos";
import Autocomplete from "@mui/material/Autocomplete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 24,
  p: 4,
};

const ModalCrearActualizarMenuEscolar = ({
  open,
  onClose,
  onMenuCreado,
  menu,
}) => {
  const [formData, setFormData] = useState({
    numero_menu: "",
    id_tipo: "",
    id_nivel_educativo: "",
  });

  const [tiposMenu, setTiposMenu] = useState([]);
  const [nivelesEducativos, setNivelesEducativos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (open) {
      if (menu) {
        setFormData({
          numero_menu: menu.numero_menu || "",
          id_tipo: menu.id_tipo || "",
          id_nivel_educativo: menu.id_nivel_educativo || "",
        });
      } else {
        setFormData({
          numero_menu: "",
          id_tipo: "",
          id_nivel_educativo: "",
        });
      }
    }
  }, [menu, open]);

  useEffect(() => {
    if (!open) return;

    const cargarDatos = async () => {
      try {
        const [tiposData, nivelesData] = await Promise.all([
          ObtenerTiposMenus(),
          ObtenerNivelesEducativos(),
        ]);

        setTiposMenu(tiposData);
        setNivelesEducativos(nivelesData);
      } catch (error) {
        console.error("Error al cargar tipos o niveles educativos:", error);
      }
    };

    cargarDatos();
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
      if (menu) {
        await ActualizarMenuEscolar({
          ...formData,
          id_menu_escolar: menu.id_menu_escolar,
        });
        onMenuCreado("actualizar");
      } else {
        await CrearMenuEscolar(formData);
        onMenuCreado("crear");
      }

      onClose();
      setFormData({
        numero_menu: "",
        id_tipo: "",
        id_nivel_educativo: "",
      });
    } catch (error) {
      console.error("Error al guardar el menú escolar:", error);

      let msg = "Ocurrió un error al guardar el menú escolar.";
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      }
      setSnackbarMessage(msg);
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
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box component="form" sx={style} onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              component="h2"
              textAlign="center"
              sx={{ fontWeight: "bold" }}
            >
              {menu ? "Actualizar Menú Escolar" : "Crear Menú Escolar"}
            </Typography>
            <TextField
              required
              id="numero_menu"
              name="numero_menu"
              label="Número del Menú"
              fullWidth
              margin="normal"
              value={formData.numero_menu}
              onChange={handleChange}
            />

            <Autocomplete
              id="id_tipo"
              options={tiposMenu}
              getOptionLabel={(option) => option.nombre_tipo || ""}
              value={
                tiposMenu.find(
                  (tipo) => String(tipo.id_tipo) === String(formData.id_tipo)
                ) || null
              }
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  id_tipo: value ? value.id_tipo : "",
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de Menú"
                  required
                  fullWidth
                  margin="normal"
                  autoComplete="off"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                String(option.id_tipo) === String(value?.id_tipo)
              }
            />
            <Autocomplete
              id="id_nivel_educativo"
              options={nivelesEducativos}
              getOptionLabel={(option) => option.nombre_nivel || ""}
              value={
                nivelesEducativos.find(
                  (nivel) =>
                    String(nivel.id_nivel_educativo) ===
                    String(formData.id_nivel_educativo)
                ) || null
              }
              onChange={(_, value) =>
                setFormData((prev) => ({
                  ...prev,
                  id_nivel_educativo: value ? value.id_nivel_educativo : "",
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nivel Educativo"
                  required
                  fullWidth
                  margin="normal"
                  autoComplete="off"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                String(option.id_nivel_educativo) ===
                String(value?.id_nivel_educativo)
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
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flex: 1 }}
              >
                {menu ? "Actualizar Menú" : "Crear Menú"}
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
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalCrearActualizarMenuEscolar;
