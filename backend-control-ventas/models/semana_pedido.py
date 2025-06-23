from .conexion_db import db
from sqlalchemy.orm import relationship

class SemanaPedido(db.Model):
    __tablename__ = 'semana_pedidos'

    id_semana_pedido = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla de semana pedidos')
    id_escuela = db.Column(db.Integer, db.ForeignKey('escuela.id_escuela'), nullable=False, comment='Llave foranea a la tabla de escuela')
    fecha_inicio = db.Column(db.Date, nullable=False, comment='Fecha de inicio de la semana')
    fecha_fin = db.Column(db.Date, nullable=False, comment='Fecha final de la semana')
    descripcion = db.Column(db.String(300), default=None, comment='Descripcion de la semana')
    estado = db.Column(db.String(50), default='abierto', comment='Si la semana esta abierta o cerrada')
    fecha_creacion = db.Column(db.DateTime, server_default=db.func.current_timestamp(), comment='Fecha de creación de la semana')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=15, comment='Llave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')

    # Clave compuesta para el FK a estado
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    escuela = relationship('Escuela', back_populates='semanas_pedidos')
    estado_rel = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='semanas_pedidos')
    pedidos = relationship('Pedido', back_populates='semana_pedido')
    
    def __repr__(self):
        return f"<SemanaPedido(id_semana_pedido={self.id_semana_pedido}, id_escuela={self.id_escuela}, fecha_inicio={self.fecha_inicio}, fecha_fin={self.fecha_fin})>"