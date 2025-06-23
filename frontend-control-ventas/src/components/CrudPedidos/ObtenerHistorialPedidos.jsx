import { axiosInstance } from "../../services/axios.config";

const ObtenerHistorialPedidos = async (
  page = 1,
  perPage = 20,
  descripcion_semana = null,
  id_semana_pedido = null
) => {
  try {
    const token = sessionStorage.getItem("token");
    const params = { page, per_page: perPage };
    if (descripcion_semana) params.descripcion_semana = descripcion_semana;
    if (id_semana_pedido) params.id_semana_pedido = id_semana_pedido;
    const response = await axiosInstance.get("/obtener_historial_pedidos", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error al obtener el historial de pedidos:", error);
    throw error;
  }
};

export default ObtenerHistorialPedidos;