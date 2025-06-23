import { axiosInstance } from '../../services/axios.config'

const EliminarProducto = async (idProducto) => {
    try {
        const token = sessionStorage.getItem("token") 
        const response = await axiosInstance.delete(`/eliminar_producto/${idProducto}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    }catch (error) {
        console.error("Error al eliminar el producto:", error); 
        throw error;
    }
}

export default EliminarProducto;