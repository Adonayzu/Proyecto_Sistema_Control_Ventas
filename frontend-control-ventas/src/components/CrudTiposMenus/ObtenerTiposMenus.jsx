import { axiosInstance } from "../../services/axios.config";

const ObtenerTiposMenus = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get("/obtener_tipo_menus", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw error;
  }
};

export default ObtenerTiposMenus;