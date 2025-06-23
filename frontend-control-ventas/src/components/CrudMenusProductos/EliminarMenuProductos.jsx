import { axiosInstance } from '../../services/axios.config';
const EliminarMenuProductos = async (idMenuProducto) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete(`/eliminar_menu_productos/${idMenuProducto}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el menú con sus productos:", error);
        throw error;
    }
};

export default EliminarMenuProductos;