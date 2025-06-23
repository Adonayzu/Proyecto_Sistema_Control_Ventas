import { axiosInstance } from "../../../services/axios.config"; 

const ActualizarPedido = async (pedidoData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_pedido/${pedidoData.id_pedido}`, 
      pedidoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    throw error;
  }
};

export default ActualizarPedido;