import { axiosInstance } from "../../services/axios.config";

const ActualizarProductoMenu = async (productoMenuData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.put(
      `/actualizar_producto_en_menu/${productoMenuData.id_menu_producto}`,
        productoMenuData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto del menú:", error);
    throw error;
  }
};

export default ActualizarProductoMenu;
