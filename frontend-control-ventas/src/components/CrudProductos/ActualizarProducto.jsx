import { axiosInstance } from "../../services/axios.config";

const ActualizarProducto = async (productoData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_producto/${productoData.id_producto}`,
        productoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

export default ActualizarProducto;
