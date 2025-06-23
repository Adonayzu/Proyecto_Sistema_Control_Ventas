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
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerTiposMenus from "../../components/CrudTiposMenus/ObtenerTiposMenus";
import EliminarTipoMenu from "../../components/CrudTiposMenus/EliminarTipoMenu";
import ModalCrearActualizarTipoMenu from "../../components/ModalTipoMenu/ModalCrearActualizarTipoMenu";
import AddIcon from "@mui/icons-material/Add";

const GestionDeTipoMenu = () => {
  const [tiposMenus, setTiposMenus] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [tipoMenuSeleccionado, setTipoMenuSeleccionado] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const crearBtnRef = useRef(null);

  useEffect(() => {
    const cargarTiposMenus = async () => {
      try {
        const data = await ObtenerTiposMenus();
        setTiposMenus(data);
      } catch (error) {
        console.error("Error al obtener los tipos de menú:", error);
      }
    };

    cargarTiposMenus();
  }, []);

  const handleOpenModal = (tipoMenu = null) => {
    setTipoMenuSeleccionado(tipoMenu);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTipoMenuSeleccionado(null);
  };

  const refrescarTipoMenu = async () => {
    try {
      const data = await ObtenerTiposMenus();
      setTiposMenus(data);
    } catch (error) {
      console.error("Error al obtener los tipos de menú:", error);
    }
  };

  const handleEliminarTipoMenu = async (tipoMenuId) => {
    try {
      await EliminarTipoMenu(tipoMenuId);

      await refrescarTipoMenu();

      setSnackbarMessage("Tipo de menú eliminado con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar el tipo de menú:", error);

      if (error.response && error.response.status === 400) {
        setSnackbarMessage(error.response.data.msg); 
      } else {
        setSnackbarMessage("Error al eliminar el tipo de menú.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleModalExited = () => {
    if (crearBtnRef.current) {
      crearBtnRef.current.focus();
    }
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Button variant="contained" color="primary" href="/menus">
            Regresar a Gestión de Menús
          </Button>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
            marginTop: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Listado de Tipos de Menús
            </Typography>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              Tipos de Menús registrados en el sistema.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ backgroundColor: "#009688" }}
            ref={crearBtnRef}
          >
            Crear Nuevo Tipo de Menú
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">Id Tipo Menú</StyledTableCell>
                <StyledTableCell align="center">Nombre</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tiposMenus.map((tipoMenu, index) => (
                <StyledTableRow key={tipoMenu.id_tipo_menu || `row-${index}`}>
                  <StyledTableCell>
                    <Stack
                      direction="row"
                      justifyContent={"space-around"}
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() => handleEliminarTipoMenu(tipoMenu.id_tipo)}
                      >
                        <Box
                          component="img"
                          src="icons/eliminar.png"
                          alt="Eliminar Tipo de Menú"
                          sx={{ width: 22, height: 22 }}
                        />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal(tipoMenu)}>
                        <Box
                          component="img"
                          src="icons/actualizar.png"
                          alt="Actualizar Tipo de Menú"
                          sx={{ width: 22, height: 22 }}
                        />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {tipoMenu.id_tipo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {tipoMenu.nombre_tipo}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCrearActualizarTipoMenu
        open={openModal}
        onClose={handleCloseModal}
        onTipoMenuCreado={refrescarTipoMenu}
        tipoMenu={tipoMenuSeleccionado}
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

export default GestionDeTipoMenu;
