import { axiosInstance } from "../../services/axios.config";

const EliminarRol = async (idRol) => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axiosInstance.delete(`/eliminar_rol/${idRol}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    throw error;
  }
};

export default EliminarRol;