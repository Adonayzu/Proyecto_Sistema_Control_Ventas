from .conexion_db import db  
from sqlalchemy.orm import relationship


class Tipo(db.Model):
    __tablename__ = 'tipo'
    
    id_tipo = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla tipo')
    nombre_tipo = db.Column(db.String(100), nullable=False, comment='Nombre del tipo de menu')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=11, comment='Llave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='tipos')
    menu_escolares = relationship('MenuEscolar', back_populates='tipo')
    
    def __repr__(self):
        return f"<Tipo(id_tipo={self.id_tipo}, nombre_tipo='{self.nombre_tipo}')>"