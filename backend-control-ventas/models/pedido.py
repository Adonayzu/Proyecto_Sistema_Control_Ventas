from .conexion_db import db  
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Pedido(db.Model):
    __tablename__ = 'pedido'
    
    id_pedido = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla pedido')
    id_escuela = db.Column(db.Integer, db.ForeignKey('escuela.id_escuela'), nullable=False, comment='Llave foranea a la tabla de escuela')
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False, comment='Llave foranea a la tabla de usuario')
    id_menu_escolar = db.Column(db.Integer, db.ForeignKey('menu_escolar.id_menu_escolar'), nullable=False, comment='Llave foranea a la tabla de menu_escolar')
    fecha_pedido = db.Column(db.Date, nullable=False, comment='Fecha que se realizo el pedido')
    id_semana_pedido = db.Column(db.Integer, db.ForeignKey('semana_pedidos.id_semana_pedido'), nullable=True, comment='Llave foranea a la tabla semana_pedidos')
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=func.now(), comment='Fecha de creación que se hizo el registro del pedido')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=13, comment='Llave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave forane a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='pedidos')
    escuela = relationship('Escuela', back_populates='pedidos')
    usuario = relationship('Usuario', back_populates='pedidos')
    menu_escolar = relationship('MenuEscolar', back_populates='pedidos')
    pedido_productos = relationship('PedidoProducto', back_populates='pedido')
    semana_pedido = relationship('SemanaPedido', back_populates='pedidos')
    
    def __repr__(self):
        return f"<Pedido(id_pedido={self.id_pedido}, id_escuela={self.id_escuela}, id_usuario={self.id_usuario}, fecha_pedido='{self.fecha_pedido}')>"
