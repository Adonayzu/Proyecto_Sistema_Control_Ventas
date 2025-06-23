from .conexion_db import db 
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Modulo(db.Model):
    __tablename__ = 'modulo'
    
    id_modulo = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria')
    nombre_modulo = db.Column(db.String(200), nullable=False, comment='Nombre del modulo')
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=func.now(), comment='Fecha de creacion del modulo')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=3, comment='Llave foránea a la tabla estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla estado')
    usr_creacion = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False, comment='Llave foránea a la tabla de usuario')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado])
    usr_creacion_rel = relationship('Usuario', foreign_keys=[usr_creacion], back_populates='modulos_creados')
    menus_navegacion = relationship('MenuNavegacion', back_populates='modulo')
    
    def __repr__(self):
        return f"<Modulo(id_modulo={self.id_modulo}, nombre_modulo='{self.nombre_modulo}', usr_creacion={self.usr_creacion})>"
