import { axiosInstance } from '../../services/axios.config';

const CrearNivelEducativo = async (nivelEducativoData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_nivel_educativo",
         nivelEducativoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el Nivel Educativo:", error);
      throw error;
    }
  };

export default CrearNivelEducativo;
