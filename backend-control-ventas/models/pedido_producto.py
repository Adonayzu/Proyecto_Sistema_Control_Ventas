from .conexion_db import db  
from sqlalchemy.orm import relationship

class PedidoProducto(db.Model):
    __tablename__ = 'pedido_producto'
    
    id_pedido_producto = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla de pedido_producto')
    id_pedido = db.Column(db.Integer, db.ForeignKey('pedido.id_pedido'), nullable=False, comment='Llave foranea a la tabla de pedido')
    id_producto = db.Column(db.Integer, db.ForeignKey('producto.id_producto'), nullable=False, comment='Llave foranea a la tabla de producto')
    cantidad = db.Column(db.DECIMAL(10, 0), nullable=False, comment='Cantidad que se pidio de un producto')
    precio_unitario = db.Column(db.DECIMAL(10, 0), nullable=False, comment='Precio unitario de producto')
    es_extra = db.Column(db.Boolean, nullable=False, default=0, comment='Si es extra algun producto o no')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=14, comment='Llave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea  a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='pedido_productos')
    pedido = relationship('Pedido', back_populates='pedido_productos')
    producto = relationship('Producto', back_populates='pedido_productos')
    
    def __repr__(self):
        return f"<PedidoProducto(id_pedido_producto={self.id_pedido_producto}, id_pedido={self.id_pedido}, id_producto={self.id_producto}, cantidad={self.cantidad}, precio_unitario={self.precio_unitario})>"