import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ObtenerMenusProductos from "../../components/CrudMenusProductos/ObtenerMenusProductos";
import ModalCrearActualizarMenuEscolar from "../../components/ModalesMenusProductos/ModalCrearActualizarMenuEscolar";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import EliminarMenuProductos from "../../components/CrudMenusProductos/EliminarMenuProductos";
import ModalAgregarProductoMenu from "../../components/ModalesMenusProductos/ModalAgregarProductoMenu";
import EliminarProductoMenu from "../../components/CrudMenusProductos/EliminarProductoMenu";

const GestionDeMenus = () => {
  const [menus, setMenus] = useState([]);
  const [filtros, setFiltros] = useState({ numero_menu: "" });
  const [menuSeleccionado, setMenuSeleccionado] = useState(null);
  const [modalCrearActualizarOpen, setModalCrearActualizarOpen] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [menuIdSeleccionado, setMenuIdSeleccionado] = useState(null);

  const cargarMenus = async (numero_menu = "") => {
    try {
      const data = await ObtenerMenusProductos(numero_menu);
      setMenus(data.menus || []);

      if ((data.menus?.length === 0 || !data.menus) && numero_menu) {
        setSnackbarMessage(
          `No se encontraron menús con el número "${numero_menu}"`
        );
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch {
      setMenus([]);
      setSnackbarMessage("Error al cargar los menús. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    cargarMenus(filtros.numero_menu);
    // eslint-disable-next-line
  }, []);

  const handleBuscar = () => {
    cargarMenus(filtros.numero_menu);
  };

  const cancelarBusqueda = () => {
    setFiltros({ numero_menu: "" });
    cargarMenus("");
  };

  const handleOpenModalCrearActualizar = (menu = null) => {
    setMenuSeleccionado(menu);
    setModalCrearActualizarOpen(true);
  };

  const handleCloseModalCrearActualizar = () => {
    setModalCrearActualizarOpen(false);
    setMenuSeleccionado(null);
  };

  const handleMenuCreado = () => {
    cargarMenus(filtros.numero_menu);
    setSnackbarMessage("Menú guardado exitosamente.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleEliminarMenu = async (idMenu) => {
    try {
      await EliminarMenuProductos(idMenu);
      setSnackbarMessage("Menú eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      cargarMenus(filtros.numero_menu);
    } catch (error) {
      let msg = "Error al eliminar el menú. Intente nuevamente.";
      if (error.response && error.response.data && error.response.data.msg) {
        msg = error.response.data.msg;
      }
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAgregarProducto = (idMenu) => {
    setMenuIdSeleccionado(idMenu);
    setModalProductoOpen(true);
  };

  const handleEliminarProducto = async (idMenuProducto) => {
    try {
      await EliminarProductoMenu(idMenuProducto);
      setSnackbarMessage("Producto eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      cargarMenus(filtros.numero_menu);
    } catch {
      setSnackbarMessage("Error al eliminar el producto. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box sx={{ margin: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: 2, textAlign: "center" }}
      >
        Gestión de Menús
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="flex-end"
        sx={{ marginBottom: 3 }}
      >
        <Button
          href="tiposmenus"
          sx={{ backgroundColor: "#009688" }}
          variant="contained"
        >
          CATÁLOGO DE TIPO DE MENÚ
        </Button>
        <Button href="niveleseducativos" color="primary" variant="contained">
          CATÁLOGO DE NIVEL EDUCATIVO
        </Button>
      </Stack>

      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h4"
          paddingBottom={2}
          component="h2"
          sx={{ fontWeight: "bold" }}
        >
          Buscar Menú por Número
        </Typography>
        <Stack spacing={2} direction="row">
          <TextField
            label="Número del Menú"
            name="numero_menu"
            value={filtros.numero_menu || ""}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, numero_menu: e.target.value }))
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
        spacing={2}
        direction="row"
        justifyContent="space-between"
        sx={{ marginBottom: 3 }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Listado de Menús Registrados en el Sistema
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModalCrearActualizar()}
        >
          Crear Nuevo Menú
        </Button>
      </Stack>

      {menus.length > 0 ? (
        menus.map((menu) => (
          <Accordion key={menu.id_menu_escolar}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Menú #{menu.numero_menu}
                  </Typography>
                  <Typography variant="body3" sx={{ marginBottom: 0.5 }}>
                    <strong>Tipo:</strong> {menu.tipo_menu} <br />
                  </Typography>
                  <Typography variant="body3">
                    <strong>Nivel Educativo:</strong> {menu.nivel_educativo}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <Stack display={"flex"} direction={"row"} justifyContent={"center"}>
              <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                <strong>Acciones para menú</strong>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mr: 4 }}
              display={"flex"}
              justifyContent={"center"}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleOpenModalCrearActualizar(menu)}
              >
                Actualizar Menú
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleEliminarMenu(menu.id_menu_escolar)}
              >
                Eliminar Menú
              </Button>
            </Stack>
            <AccordionDetails>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Productos del Menú:
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ backgroundColor: "#009688", marginLeft: "auto" }}
                  onClick={() => handleAgregarProducto(menu.id_menu_escolar)}
                >
                  Agregar Producto
                </Button>
              </Stack>

              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        Nombre Producto
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Precio Unitario
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Categoría
                      </StyledTableCell>
                      <StyledTableCell align="center">Acciones</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {menu.productos.length > 0 ? (
                      menu.productos.map((producto) => (
                        <StyledTableRow key={producto.id_menu_producto}>
                          <StyledTableCell align="center">
                            {producto.nombre_producto}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Q{producto.precio_venta.toFixed(2)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {producto.nombre_categoria}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <IconButton
                              onClick={() =>
                                handleEliminarProducto(
                                  producto.id_menu_producto
                                )
                              }
                            >
                              <Box
                                component="img"
                                src="/icons/eliminar.png"
                                alt="Eliminar Producto"
                                sx={{ width: 22, height: 22 }}
                              />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={4} align="center">
                          Sin productos
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {filtros.numero_menu
              ? `No se encontró ningún menú con el número "${filtros.numero_menu}".`
              : "No se encontraron menús"}
          </Typography>
          {filtros.numero_menu && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Intente con otro número de menú o cree un nuevo menú.
            </Typography>
          )}
        </Paper>
      )}

      <ModalCrearActualizarMenuEscolar
        open={modalCrearActualizarOpen}
        onClose={handleCloseModalCrearActualizar}
        onMenuCreado={handleMenuCreado}
        menu={menuSeleccionado}
      />

      <ModalAgregarProductoMenu
        open={modalProductoOpen}
        onClose={() => setModalProductoOpen(false)}
        onProductoActualizado={() => cargarMenus(filtros.numero_menu)}
        idMenu={menuIdSeleccionado}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionDeMenus;