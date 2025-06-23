import { axiosInstance } from "../../services/axios.config";

const ActualizarEscuela = async (escuelaData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_escuela/${escuelaData.id_escuela}`,
        escuelaData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la escuela:", error);
    throw error;
  }
};

export default ActualizarEscuela;
