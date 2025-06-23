import { axiosInstance } from '../../services/axios.config';
const EliminarCategoria = async (idCategoria) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete(`/eliminar_categoria/${idCategoria}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        throw error;
    }
};

export default EliminarCategoria;
