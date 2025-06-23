from .conexion_db import db 
from sqlalchemy.orm import relationship

class MenuEscolar(db.Model):
    __tablename__ = 'menu_escolar'
    
    id_menu_escolar = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla menu_escolar')
    numero_menu = db.Column(db.Integer, nullable=False, comment='Numero de menu escolar')
    id_tipo = db.Column(db.Integer, db.ForeignKey('tipo.id_tipo'), nullable=False, comment='Llave foranea a la tabla de tipo')
    id_nivel_educativo = db.Column(db.Integer, db.ForeignKey('nivel_educativo.id_nivel_educativo'), nullable=False, comment='Llave foranea a la tabla de nivel_educativo')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=9, comment='Llave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='menu_escolares')
    tipo = relationship('Tipo', back_populates='menu_escolares')
    nivel_educativo = relationship('NivelEducativo', back_populates='menu_escolares')
    menu_productos = relationship('MenuProducto', back_populates='menu_escolar')
    pedidos = relationship('Pedido', back_populates='menu_escolar')
    
    def __repr__(self):
        return f"<MenuEscolar(id_menu_escolar={self.id_menu_escolar}, nombre_menu='{self.nombre_menu}', id_tipo={self.id_tipo}, id_nivel_educativo={self.id_nivel_educativo})>"
