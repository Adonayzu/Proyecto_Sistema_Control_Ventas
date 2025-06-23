import { axiosInstance } from "../../../services/axios.config";

const CrearPedido = async (pedidoData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.post("/crear_pedido", pedidoData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el Pedido:", error);
    throw error;
  }
};

export default CrearPedido;