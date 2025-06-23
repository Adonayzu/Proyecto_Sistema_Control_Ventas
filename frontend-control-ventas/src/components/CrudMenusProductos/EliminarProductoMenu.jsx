import { axiosInstance } from '../../services/axios.config';

const EliminarProductoMenu = async (idProductoMenu) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete(`/eliminar_producto_de_menu/${idProductoMenu}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el producto del menú:", error);
        throw error;
    }
};

export default EliminarProductoMenu;