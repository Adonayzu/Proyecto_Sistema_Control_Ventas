import { axiosInstance } from "../../services/axios.config";

const ActualizarSemanaPedido = async (semanaPedidoData) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.put(
      `/actualizar_semana_pedido/${semanaPedidoData.id_semana_pedido}`, // Incluir el id en la URL
        semanaPedidoData, // Enviar todos los datos del producto
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token en los headers
          "Content-Type": "application/json", // Especificar el tipo de contenido
        },
      }
    );
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al actualizar la semana pedido:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ActualizarSemanaPedido
