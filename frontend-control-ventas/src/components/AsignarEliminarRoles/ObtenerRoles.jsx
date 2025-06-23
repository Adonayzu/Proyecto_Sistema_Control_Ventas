import { axiosInstance } from "../../services/axios.config";

const ObtenerRoles = async (idUsuario) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get(`/obtener_roles/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};

export default ObtenerRoles;



