import { axiosInstance } from '../../services/axios.config';

const EliminarNivelEducativo = async (idNivelEducativo) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete(`/eliminar_nivel_educativo/${idNivelEducativo}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el Nivel Educativo:", error);
        throw error;
    }
};

export default EliminarNivelEducativo;
