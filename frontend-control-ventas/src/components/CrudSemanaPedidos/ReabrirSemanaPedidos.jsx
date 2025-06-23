import { axiosInstance } from "../../services/axios.config";

const ReabrirSemanaPedidos = async (id_semana_pedido) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/reabrir_semana_y_pedidos/${id_semana_pedido}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al reabrir la semana y sus pedidos asociados:", error);
    throw error;
  }
};

export default ReabrirSemanaPedidos;