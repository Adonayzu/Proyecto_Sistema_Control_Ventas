from .conexion_db import db  
from sqlalchemy.orm import relationship

class Categoria(db.Model):
    __tablename__ = 'categoria'
    
    id_categoria = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla categoria')
    nombre_categoria = db.Column(db.String(200), nullable=False, comment='Nombre de la categoria')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=7, comment='Llave foranea de la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='categorias')
    productos = relationship('Producto', back_populates='categoria')
    
    def __repr__(self):
        return f"<Categoria(id_categoria={self.id_categoria}, nombre_categoria='{self.nombre_categoria}')>"
