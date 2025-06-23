import { axiosInstance } from '../../services/axios.config';

const EliminarEscuela = async (idEscuela) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete(`/eliminar_escuela/${idEscuela}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la escuela:", error);
        throw error;
    }
};

export default EliminarEscuela;
