from .conexion_db import db  
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class MenuNavegacion(db.Model):
    __tablename__ = 'menu_navegacion'
    
    id_menu_navegacion = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave foránea de la tabla menu_navegacion')
    nombre_menu_navegacion = db.Column(db.String(200), nullable=False, comment='Nombre de menu a seleccionar')
    url_menu = db.Column(db.String(300), nullable=False, comment='La url del menu')
    id_modulo = db.Column(db.Integer, db.ForeignKey('modulo.id_modulo'), nullable=False, comment='Llave foránea a la tabla de modulos')
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=func.now(), comment='Fecha de creación del menu')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=4, comment='Llave foránea a la tabla estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estados')
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
    modulo = relationship('Modulo', back_populates='menus_navegacion')
    usr_creacion_rel = relationship('Usuario', foreign_keys=[usr_creacion], back_populates='menus_navegacion_creados')
    roles = relationship('Roles', back_populates='menu_navegacion')
    
    
    def __repr__(self):
        return f"<MenuNavegacion(id_menu_navegacion={self.id_menu_navegacion}, nombre_menu_navegacion='{self.nombre_menu_navegacion}', url_menu='{self.url_menu}')>"
