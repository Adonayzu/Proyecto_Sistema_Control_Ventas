from .conexion_db import db 
from sqlalchemy.orm import relationship


class NivelEducativo(db.Model):
    __tablename__ = 'nivel_educativo'
    
    id_nivel_educativo = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla nivel_educativo')
    nombre_nivel = db.Column(db.String(200), nullable=False, comment='Nombre del nivel educativo')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=10, comment='Llave foranea a la tabla estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='nivel_educativos')
    menu_escolares = relationship('MenuEscolar', back_populates='nivel_educativo')

    def __repr__(self):
        return f"<NivelEducativo(id_nivel_educativo={self.id_nivel_educativo}, nombre_nivel='{self.nombre_nivel}')>"

