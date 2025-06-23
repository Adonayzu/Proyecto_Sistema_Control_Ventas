import { axiosInstance } from '../../services/axios.config';

const CrearMenuEscolar = async (menuEscolarData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.post("/crear_menu_escolar", menuEscolarData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el Menú Escolar:", error);
    throw error;
  }
};

export default CrearMenuEscolar;