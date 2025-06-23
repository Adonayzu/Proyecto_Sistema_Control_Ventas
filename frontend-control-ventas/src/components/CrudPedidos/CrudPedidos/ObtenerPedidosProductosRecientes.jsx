import { axiosInstance } from "../../../services/axios.config";

const ObtenerPedidosProductosRecientes = async (
  page = 1,
  per_page = 15,
  descripcion_semana = "",
  id_semana_pedido = null
) => {
  const token = sessionStorage.getItem("token");
  const params = {
    page,
    per_page,
  };
  if (descripcion_semana) params.descripcion_semana = descripcion_semana;
  if (id_semana_pedido) params.id_semana_pedido = id_semana_pedido;

  const response = await axiosInstance.get("/obtener_pedidos_recientes", {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default ObtenerPedidosProductosRecientes;