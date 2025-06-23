import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { axiosInstance } from "../../services/axios.config";

const UserInfo = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.get("/check_user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data[0];
        if (userData && userData.usuario) {
          const { nombres, apellidos } = userData.usuario;
          setUserName(`${nombres} ${apellidos}`);
        } else {
          console.error("La respuesta no contiene información del usuario.");
          setUserName("Usuario desconocido");
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setUserName("Usuario desconocido");
      }
    };

    fetchUserName();
  }, []);

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 1.5 }}>
      <IconButton variant="contained">
        <Box
          component="img"
          src="/icons/user_logiado.png"
          alt="Inicio"
          sx={{ width: 40, height: 40 }}
        />
      </IconButton>
      <Typography variant="body1" sx={{ marginLeft: 1, color: "black", fontWeight: "bold" }}>
        {userName}
      </Typography>
    </Box>
  );
};

export default UserInfo;