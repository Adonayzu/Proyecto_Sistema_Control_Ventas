import { axiosInstance } from "../../services/axios.config";

const ActualizarCategoria = async (categoriaData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_categoria/${categoriaData.id_categoria}`,
      { nombre_categoria: categoriaData.nombre_categoria },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    throw error;
  }
};

export default ActualizarCategoria;
