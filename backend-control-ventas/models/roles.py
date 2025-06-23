from .conexion_db import db 
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Roles(db.Model):
    __tablename__ = 'roles'
    
    id_rol = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla')
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False, comment='Llave foránea a la tabla de usuario')
    id_menu_navegacion = db.Column(db.Integer, db.ForeignKey('menu_navegacion.id_menu_navegacion'), nullable=False, comment='Llave foránea a la tabla de menu_navegacion')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=5, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea de la tabla estado')
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=func.now(), comment='Fecha de creación del rol')
    usr_creacion = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False, comment='Llave foránea a la tabla de usuario')
    fecha_baja = db.Column(db.DateTime, comment='Fecha de baja del usuario')
    usr_modificacion = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=True, comment='Llave foránea a la tabla usuario')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='roles')
    usuario = relationship('Usuario', foreign_keys=[id_usuario], back_populates='roles_asignados')
    menu_navegacion = relationship('MenuNavegacion', back_populates='roles')
    usr_creacion_rel = relationship('Usuario', foreign_keys=[usr_creacion], back_populates='roles_creados')
    usr_modificacion_rel = relationship('Usuario', foreign_keys=[usr_modificacion], back_populates='roles_modificados')
    
    def _repr_(self):
        return f"<Roles(id_rol={self.id_rol}, id_usuario={self.id_usuario}, id_menu_navegacion={self.id_menu_navegacion})>"
    

    def to_dict(self):
        return {
            "id_rol": self.id_rol,
            "id_usuario": self.id_usuario,
            "nombre_menu": self.menu_navegacion.nombre_menu_navegacion if self.menu_navegacion else None,
            "id_estado": self.id_estado,
            "fecha_creacion": self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            "fecha_baja": self.fecha_baja.isoformat() if self.fecha_baja else None
        }