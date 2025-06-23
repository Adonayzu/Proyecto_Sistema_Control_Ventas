from .conexion_db import db  # Importamos db primero
from .tipo_estado import TipoEstado
from .estado import Estado
from .persona import Persona
from .usuario import Usuario
from .modulo import Modulo
from .menu_navegacion import MenuNavegacion
from .roles import Roles
from .escuela import Escuela
from .categoria import Categoria
from .producto import Producto
from .nivel_educativo import NivelEducativo
from .tipo import Tipo
from .menu_escolar import MenuEscolar
from .menu_producto import MenuProducto
from .pedido import Pedido
from .pedido_producto import PedidoProducto

# Exportamos los modelos para facilitar su uso
__all__ = [
    'TipoEstado', 'Estado', 'Persona', 'Usuario', 'Modulo', 'MenuNavegacion',
    'Roles', 'Escuela', 'Categoria', 'Producto', 'Dia', 'NivelEducativo',
    'Tipo', 'MenuEscolar', 'MenuProducto', 'Pedido', 'PedidoProducto'
]