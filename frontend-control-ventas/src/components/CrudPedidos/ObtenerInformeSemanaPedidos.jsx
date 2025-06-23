import { axiosInstance } from "../../services/axios.config";

const ObtenerInformeSemanaPedidos = async (id_semana_pedido, id_escuela) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get(
      `/informe_detallado_semana_pedido?id_semana_pedido=${id_semana_pedido}&id_escuela=${id_escuela}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el informe de la semana:", error);
    throw error;
  }
};

export default ObtenerInformeSemanaPedidos;