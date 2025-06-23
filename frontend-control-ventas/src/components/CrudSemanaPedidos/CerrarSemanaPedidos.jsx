import { axiosInstance } from "../../services/axios.config";

const CerrarSemanaPedidos = async (id_semana_pedido) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/cerrar_semana_pedido/${id_semana_pedido}`,
      {}, // No se envía body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al cerrar la semana y sus pedidos asociados:", error);
    throw error;
  }
};

export default CerrarSemanaPedidos;