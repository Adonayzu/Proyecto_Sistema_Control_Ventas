import { axiosInstance } from "../../services/axios.config";

const ActualizarTipoMenu = async (tipoMenuData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_tipo_menu/${tipoMenuData.id_tipo}`,
        tipoMenuData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el Tipo de Menú:", error);
    throw error;
  }
};

export default ActualizarTipoMenu;
