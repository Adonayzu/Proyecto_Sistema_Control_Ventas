import { axiosInstance } from "../../services/axios.config"; 

const ObtenerUsuarios = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get("/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error; 
  }
};

export default ObtenerUsuarios;