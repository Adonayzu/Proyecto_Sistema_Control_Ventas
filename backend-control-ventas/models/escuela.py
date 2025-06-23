from .conexion_db import db  
from sqlalchemy.orm import relationship


class Escuela(db.Model):
    __tablename__ = 'escuela'
    
    id_escuela = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primara de la tabla escuela')
    nombre_escuela = db.Column(db.String(300), nullable=False, comment='Nombre de cliente en este caso la escuela')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=6, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, comment='Llave foránea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='escuelas')
    pedidos = relationship('Pedido', back_populates='escuela')
    semanas_pedidos = relationship('SemanaPedido', back_populates='escuela')
    
    def __repr__(self):
        return f"<Escuela(id_escuela={self.id_escuela}, nombre_escuela='{self.nombre_escuela}')>"
