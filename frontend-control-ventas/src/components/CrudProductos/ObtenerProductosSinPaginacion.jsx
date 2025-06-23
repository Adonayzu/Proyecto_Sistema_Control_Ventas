import { axiosInstance } from "../../services/axios.config";

const ObtenerProductos = async (nombre_producto = "") => {
  try {
    const token = sessionStorage.getItem("token");
    const params = {};
    if (nombre_producto) params.nombre_producto = nombre_producto;
    const response = await axiosInstance.get("/obtener_productos_sin_paginacion", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export default ObtenerProductos;