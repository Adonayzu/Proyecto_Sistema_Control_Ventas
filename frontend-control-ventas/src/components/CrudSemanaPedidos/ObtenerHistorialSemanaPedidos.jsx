import { axiosInstance } from "../../services/axios.config";

const ObtenerHistorialSemanasPedidos = async (page = 1, perPage = 20, descripcion = null, id_escuela = null) => {
  try {
    const token = sessionStorage.getItem("token");
    const params = { page, per_page: perPage };
    if (descripcion) params.descripcion = descripcion;
    if (id_escuela) params.id_escuela = id_escuela;
    const response = await axiosInstance.get("/obtener_historial_semanas_pedidos", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error al obtener el historial de semanas de pedidos:", error);
    throw error;
  }
};

export default ObtenerHistorialSemanasPedidos;