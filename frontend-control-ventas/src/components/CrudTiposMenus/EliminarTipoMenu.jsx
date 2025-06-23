import { axiosInstance } from '../../services/axios.config'


const EliminarTipoMenu = async (idTipoMenu) => {
    try {
        const token = sessionStorage.getItem("token") 
        const response = await axiosInstance.delete(`/eliminar_tipo_menu/${idTipoMenu}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    }catch (error) {
        console.error("Error al eliminar el Tipo de Menú:", error); 
        throw error;
    }
}

export default EliminarTipoMenu;
