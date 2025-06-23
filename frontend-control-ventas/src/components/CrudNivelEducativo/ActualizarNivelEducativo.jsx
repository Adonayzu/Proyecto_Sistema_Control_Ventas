import { axiosInstance } from "../../services/axios.config";

const ActualizarNivelEducativo = async (nivelEducativoData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_nivel_educativo/${nivelEducativoData.id_nivel_educativo}`,
        nivelEducativoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el Nivel Educativo:", error);
    throw error;
  }
};

export default ActualizarNivelEducativo;