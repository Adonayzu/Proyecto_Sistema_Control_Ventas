import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import ObtenerInformeSemanaPedidos from "../../components/CrudPedidos/ObtenerInformeSemanaPedidos";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InformeSemanaPedidos = () => {
  const { id_semana_pedido, id_escuela } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");

  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInforme = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await ObtenerInformeSemanaPedidos(
          id_semana_pedido,
          id_escuela
        );
        setInforme(data);
      } catch {
        setError("No se pudo obtener el informe.");
      } finally {
        setLoading(false);
      }
    };
    fetchInforme();
  }, [id_semana_pedido, id_escuela]);

  const handleDownloadPDF = () => {
    if (!informe) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Informe Detallado de Semana de Pedidos", 105, 15, {
      align: "center",
    });
    doc.setFontSize(13);
    doc.text(`Escuela: ${informe.nombre_escuela || ""}`, 105, 25, {
      align: "center",
    });
    doc.text("Factura", 105, 35, { align: "center" });

    let currentY = 45;
    if (
      informe.productos_por_categoria &&
      Object.keys(informe.productos_por_categoria).length > 0
    ) {
      Object.entries(informe.productos_por_categoria).forEach(
        ([categoria, productos]) => {
          doc.setFontSize(13);
          doc.text(`${categoria}`, 15, currentY);
          autoTable(doc, {
            head: [
              [
                "Producto",
                "Cantidad",
                "Precio Unitario",
                "Subtotal",
              ],
            ],
            body: productos.map((prod) => [
              prod.nombre_producto,
              prod.cantidad,
              `Q${Number(prod.precio_unitario).toFixed(2)}`,
              `Q${Number(prod.subtotal).toFixed(2)}`,
            ]),
            startY: currentY + 3,
            styles: { halign: "center" },
            headStyles: { fillColor: [0, 150, 136] },
            margin: { left: 15, right: 15 },
            theme: "grid"
          });
          let lastY = doc.lastAutoTable.finalY || currentY + 20;
          doc.setFontSize(12);
          doc.text(
            `Subtotal ${categoria}: Q${Number(
              informe.subtotales_categoria[categoria] || 0
            ).toFixed(2)}`,
            180,
            lastY + 7,
            { align: "right" }
          );
          currentY = lastY + 15;
        }
      );
    }

    doc.setFontSize(14);
    doc.text(
      `TOTAL SEMANA: Q${Number(informe.total_general || 0).toFixed(2)}`,
      180,
      currentY + 10,
      { align: "right" }
    );

    doc.save("informe_semana_pedidos.pdf");
  };

  return (
    <Box sx={{ m: 4 }}>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ marginBottom: 2 }}
      >
        {from === "gestion" && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/semanapedidos"
            sx={{
              backgroundColor: "#e65100",
              "&:hover": { backgroundColor: "#f57c00" },
            }}
          >
            Regresar a Gestión de Semana de Pedidos
          </Button>
        )}
        {from === "historial" && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/historialsemanaspedidos"
            sx={{
              backgroundColor: "#e65100",
              "&:hover": { backgroundColor: "#f57c00" },
            }}
          >
            Regresar a Historial de Semana de Pedidos
          </Button>
        )}
      </Stack>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
      >
        Informe Detallado de Semana de Pedidos
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
        {informe?.nombre_escuela}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        Factura
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          disabled={!informe}
          sx={{
            backgroundColor: "#009688",
            "&:hover": { backgroundColor: "#00796b" },
          }}
        >
          Descargar PDF
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {informe?.productos_por_categoria &&
            Object.entries(informe.productos_por_categoria).map(
              ([categoria, productos]) => (
                <Box key={categoria} sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {categoria}
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">
                            Producto
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Cantidad
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Precio Unitario
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Subtotal
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productos.map((prod, idx) => (
                          <StyledTableRow key={idx}>
                            <StyledTableCell align="center">
                              {prod.nombre_producto}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {prod.cantidad}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Q{Number(prod.precio_unitario).toFixed(2)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Q{Number(prod.subtotal).toFixed(2)}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                        <StyledTableRow>
                          <StyledTableCell
                            align="center"
                            colSpan={3}
                            sx={{ fontWeight: "bold" }}
                          >
                            Subtotal {categoria}
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            sx={{ fontWeight: "bold" }}
                          >
                            Q
                            {Number(
                              informe.subtotales_categoria[categoria] || 0
                            ).toFixed(2)}
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )
            )}

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ maxWidth: 400, ml: "auto" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mt: 2, textAlign: "right" }}
            >
              TOTAL DE VENTA SEMANA: Q
              {Number(informe?.total_general || 0).toFixed(2)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default InformeSemanaPedidos;