import { axiosInstance } from '../../services/axios.config';

const AgregarProductoMenu = async (idMenuEscolar, productoMenuData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.post(`/agregar_producto_a_menu/${idMenuEscolar}`, productoMenuData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al agregar un nuevo producto al menú:", error);
        throw error;
    }
};

export default AgregarProductoMenu;