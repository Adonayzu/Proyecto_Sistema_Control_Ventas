import { axiosInstance } from "../../services/axios.config";

const ObtenerEscuelas = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get("/obtener_escuelas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las escuelas:", error);
    throw error;
  }
};

export default ObtenerEscuelas;