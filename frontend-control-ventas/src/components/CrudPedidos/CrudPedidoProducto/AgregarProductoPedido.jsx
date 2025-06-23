import { axiosInstance } from "../../../services/axios.config";

const AgregarProductoPedido = async (idPedido, productoPedidoData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.post(`/agregar_producto_pedido/${idPedido}`, productoPedidoData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al agregar un nuevo producto al pedido:", error);
        throw error;
    }
};

export default AgregarProductoPedido;