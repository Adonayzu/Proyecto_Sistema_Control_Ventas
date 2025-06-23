from .conexion_db import db
from sqlalchemy.orm import relationship

class Estado(db.Model):
    __tablename__ = 'estado'

    id_estado = db.Column(db.Integer, primary_key=True, comment='Llave primaria')
    id_tipo_estado = db.Column(db.Integer, db.ForeignKey('tipo_estado.id_tipo_estado'), primary_key=True, comment='Llave foránea a la tabla de tipo estado')
    nombre_estado = db.Column(db.String(200), nullable=False, comment='Nombre de estado')
    estado = db.Column(db.CHAR(1), nullable=False, default='A', comment='Estado de la tupla A = Activo e I = Inactivo')

    # Relaciones
    tipo_estado = relationship('TipoEstado', back_populates='estados')
    personas = relationship('Persona', back_populates='estado', foreign_keys='Persona.id_estado')
    categorias = relationship('Categoria', back_populates='estado', foreign_keys='Categoria.id_estado')
    roles = relationship('Roles', back_populates='estado')
    escuelas = relationship('Escuela', back_populates='estado')
    productos = relationship('Producto', back_populates='estado')
    nivel_educativos = relationship('NivelEducativo', back_populates='estado')
    tipos = relationship('Tipo', back_populates='estado')
    menu_escolares = relationship('MenuEscolar', back_populates='estado')
    menu_productos = relationship('MenuProducto', back_populates='estado')
    pedidos = relationship('Pedido', back_populates='estado')
    pedido_productos = relationship('PedidoProducto', back_populates='estado') 
    semanas_pedidos = relationship('SemanaPedido', back_populates='estado_rel')

    def __repr__(self):
        return f"<Estado(id_estado={self.id_estado}, id_tipo_estado={self.id_tipo_estado}, nombre_estado='{self.nombre_estado}', estado='{self.estado}')>"