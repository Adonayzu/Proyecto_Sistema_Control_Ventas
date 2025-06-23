import { axiosInstance } from "../../services/axios.config";

const ActualizarUsuario = async (usuarioData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_usuario/${usuarioData.id_usuario}`,
      usuarioData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

export default ActualizarUsuario;
