import { axiosInstance } from '../../services/axios.config';

const CrearEscuela = async (escuelaData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_escuela", escuelaData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la escuela:", error);
      throw error;
    }
  };

export default CrearEscuela;
