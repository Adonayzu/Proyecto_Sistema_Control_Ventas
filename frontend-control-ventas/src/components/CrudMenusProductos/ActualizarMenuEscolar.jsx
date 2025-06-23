import { axiosInstance } from "../../services/axios.config";

const ActualizarMenuEscolar = async (menuEscolarData) => {
  try {
    const token = sessionStorage.getItem("token"); // Obtener el token de sesión
    const response = await axiosInstance.put(
      `/actualizar_menu_escolar/${menuEscolarData.id_menu_escolar}`, // Incluir el id_menu_escolar en la URL
        menuEscolarData, // Enviar todos los datos del producto
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token en los headers
          "Content-Type": "application/json", // Especificar el tipo de contenido
        },
      }
    );
    return response.data; // Devolver la respuesta de la API
  } catch (error) {
    console.error("Error al actualizar el menú escolar:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

export default ActualizarMenuEscolar;
