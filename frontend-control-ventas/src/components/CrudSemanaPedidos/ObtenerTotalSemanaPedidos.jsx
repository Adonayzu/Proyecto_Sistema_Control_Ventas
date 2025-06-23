import { axiosInstance } from "../../services/axios.config";

const ObtenerTotalSemanaPedidos = async (id_semana_pedido, id_escuela) => {
  const token = sessionStorage.getItem("token");
  const response = await axiosInstance.get(
    `/total_semana_pedido?id_semana_pedido=${id_semana_pedido}&id_escuela=${id_escuela}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.total_semana || 0;
};

export default ObtenerTotalSemanaPedidos;