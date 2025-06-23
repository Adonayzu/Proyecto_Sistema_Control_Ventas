import { axiosInstance } from "../../services/axios.config";

const ObtenerProductos = async (page = 1, perPage = 20, nombre_producto = "") => {
  try {
    const token = sessionStorage.getItem("token");
    const params = { page, per_page: perPage };
    if (nombre_producto) params.nombre_producto = nombre_producto;
    const response = await axiosInstance.get("/obtener_productos", {
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