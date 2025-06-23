import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Stack } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";

const Inicio = () => {
  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
          boxShadow: 6,
          textAlign: "center",
          p: 3,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "#3b82f6", width: 72, height: 72 }}>
            <StorefrontIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Typography variant="h4" color="primary" fontWeight={700}>
            ¡Bienvenido!
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Sistema de Control de Ventas
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            Gestiona tus ventas, clientes y productos de manera sencilla y eficiente.<br />
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default Inicio;