import { axiosInstance } from "../../services/axios.config";

const ObtenerNivelesEducativos = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get("/obtener_niveles_educativos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los Niveles Educativos:", error);
    throw error;
  }
};

export default ObtenerNivelesEducativos;