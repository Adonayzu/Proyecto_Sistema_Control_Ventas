from .conexion_db import db  
from sqlalchemy.orm import relationship


class Producto(db.Model):
    __tablename__ = 'producto'
    
    id_producto = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla producto')
    nombre_producto = db.Column(db.String(200), nullable=False, comment='Nombre del producto')
    precio_venta = db.Column(db.DECIMAL(10, 0), nullable=False, comment='Precio de venta del producto')
    id_categoria = db.Column(db.Integer, db.ForeignKey('categoria.id_categoria'), nullable=False, comment='Llave forárena a la tabla de categoria')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=8, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, comment='Llave foranea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='productos')
    categoria = relationship('Categoria', back_populates='productos')
    menu_productos = relationship('MenuProducto', back_populates='producto')
    pedido_productos = relationship('PedidoProducto', back_populates='producto')
    
    def __repr__(self):
        return f"<Producto(id_producto={self.id_producto}, nombre_producto='{self.nombre_producto}', id_categoria={self.id_categoria})>"
