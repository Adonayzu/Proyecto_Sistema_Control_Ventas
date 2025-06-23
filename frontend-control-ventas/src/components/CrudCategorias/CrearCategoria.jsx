import { axiosInstance } from '../../services/axios.config';

const CrearCategoria = async (categoriaData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_categoria", categoriaData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      throw error;
    }
  };

export default CrearCategoria;
