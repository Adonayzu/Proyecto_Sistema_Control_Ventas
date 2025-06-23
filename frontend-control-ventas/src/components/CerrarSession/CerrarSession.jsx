import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../services/axios.config";

const CerrarSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cerrarSesion = async () => {
      try {
        await axiosInstance.post("/salir", {}, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        sessionStorage.removeItem("token");

        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        navigate("/");
      }
    };

    cerrarSesion();
  }, [navigate]);

  return <div>Cerrando sesión...</div>;
};

export default CerrarSession;