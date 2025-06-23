import { axiosInstance } from "../../../services/axios.config";
const EliminarPedidoProductos = async (idPedidoProducto) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete(`/eliminar_pedido_productos/${idPedidoProducto}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el menú con sus productos:", error);
        throw error;
    }
};
export default EliminarPedidoProductos;