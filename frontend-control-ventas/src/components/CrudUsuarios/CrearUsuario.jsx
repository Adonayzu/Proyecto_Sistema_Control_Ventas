import { axiosInstance } from '../../services/axios.config';
const CrearUsuario = async (usuarioData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_usuario", usuarioData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error;
    }
  };

export default CrearUsuario;
