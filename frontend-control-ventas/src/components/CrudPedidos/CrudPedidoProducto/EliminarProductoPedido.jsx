import { axiosInstance } from "../../../services/axios.config";

const eliminarProductoDePedido = async (id_pedido_producto) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.delete(`/eliminar_producto_pedido/${id_pedido_producto}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto del pedido:", error);
    throw error;
  }
};

export default eliminarProductoDePedido;