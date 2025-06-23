import { axiosInstance } from '../../services/axios.config';

const CrearProducto = async (productoData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.post("/crear_producto", productoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw error;
    }
  };

export default CrearProducto;
