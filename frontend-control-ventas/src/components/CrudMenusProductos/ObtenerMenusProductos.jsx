import { axiosInstance } from "../../services/axios.config";

const ObtenerMenusProductos = async (numero_menu = "") => {
  try {
    const token = sessionStorage.getItem("token");
    const params = {};
    if (numero_menu) params.numero_menu = numero_menu;
    const response = await axiosInstance.get("/obtener_menus_con_productos", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los Menús:", error);
    throw error;
  }
};

export default ObtenerMenusProductos;