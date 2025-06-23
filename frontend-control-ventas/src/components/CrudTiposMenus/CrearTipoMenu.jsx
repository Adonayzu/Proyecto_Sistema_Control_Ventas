import { axiosInstance } from '../../services/axios.config';

const CrearTipoMenu = async (tipoMenuData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_tipo_menu", tipoMenuData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el Tipo de Menú:", error);
      throw error;
    }
  };

export default CrearTipoMenu;
