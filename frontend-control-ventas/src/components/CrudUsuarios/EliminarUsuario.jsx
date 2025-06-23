import { axiosInstance } from "../../services/axios.config";

const EliminarUsuario = async (idUsuario) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.delete(`/eliminar_usuario/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};

export default EliminarUsuario;