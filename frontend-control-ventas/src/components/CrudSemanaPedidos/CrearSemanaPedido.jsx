import { axiosInstance } from '../../services/axios.config';

const CrearSemanaPedido = async (semanaPedidoData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_semana_pedido", semanaPedidoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la semana pedido:", error);
      throw error;
    }
  };

export default CrearSemanaPedido;
