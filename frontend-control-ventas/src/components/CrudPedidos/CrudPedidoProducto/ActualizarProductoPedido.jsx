import { axiosInstance } from "../../../services/axios.config";

const ActualizarProductoPedido = async (productoPedidoData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_producto_pedido/${productoPedidoData.id_pedido_producto}`,
        productoPedidoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto del pedido:", error);
    throw error;
  }
};

export default ActualizarProductoPedido;
