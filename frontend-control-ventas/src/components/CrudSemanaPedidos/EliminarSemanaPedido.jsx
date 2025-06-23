import { axiosInstance } from '../../services/axios.config'


const EliminarSemanaPedido = async (idSemanaPedido) => {
    try {
        const token = sessionStorage.getItem("token") 
        const response = await axiosInstance.delete(`/eliminar_semana_pedido/${idSemanaPedido}`,{
            headers: {
                Authorization: `Bearer ${token}`,

            },
             
        });
        return response.data; 
    }catch (error) {
        console.error("Error al eliminar la semana pedido:", error); 
        throw error;
    }
}

export default EliminarSemanaPedido;