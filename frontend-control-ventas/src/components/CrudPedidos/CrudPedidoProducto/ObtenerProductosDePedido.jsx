import { axiosInstance } from "../../../services/axios.config"; 

const ObtenerProductosDePedido = async (id_pedido, nombre_producto = "") => {
  try {
    const token = sessionStorage.getItem("token");
    let url = `/obtener_productos_pedido/${id_pedido}`;
    if (nombre_producto && nombre_producto.trim() !== "") {
      url += `?nombre_producto=${encodeURIComponent(nombre_producto)}`;
    }
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos del pedido:", error);
    throw error;
  }
};

export default ObtenerProductosDePedido;