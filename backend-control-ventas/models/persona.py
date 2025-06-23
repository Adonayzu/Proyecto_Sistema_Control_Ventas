from .conexion_db import db 
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Persona(db.Model):
    __tablename__ = 'persona'
    
    id_persona = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria a la tabla persona')
    nombres = db.Column(db.String(200), nullable=False, comment='Nombres de la persona')
    apellidos = db.Column(db.String(200), nullable=False, comment='Apellidos de las personas')
    telefono = db.Column(db.Integer, comment='Numero de telefono de la persona')
    direccion = db.Column(db.String(200), comment='Direccion de la persona')
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=func.now(), comment='Fecha de creación de la persona')
    id_tipo_estado = db.Column(db.Integer, default=1, comment='Llaver foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, default=1, comment='Llave foránea a la tabla estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='personas')
    usuarios = relationship('Usuario', back_populates='persona')
    
    def __repr__(self):
        return f"<Persona(id_persona={self.id_persona}, nombres='{self.nombres}', apellidos='{self.apellidos}', genero='{self.genero}')>"
