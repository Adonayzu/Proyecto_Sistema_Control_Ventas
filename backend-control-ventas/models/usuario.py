from .conexion_db import db  
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Usuario(db.Model):
    __tablename__ = 'usuario'

    id_usuario = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla de usuario.')
    usuario = db.Column(db.String(200), nullable=False, unique=True, comment='Usuario de la persona que utilizará el sistema')
    clave = db.Column(db.String(200), nullable=False, comment='Clave o contraseña del usuario')
    id_persona = db.Column(db.Integer, db.ForeignKey('persona.id_persona'), nullable=False, comment='Llave foránea a la tabla de persona')
    puesto = db.Column(db.String(200), nullable=False, comment='Puesto de la persona que está utilizando el sistema')
    fecha_creacion = db.Column(db.DateTime, nullable=False, server_default=func.now(),  comment='Fecha de creación del usuario')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=2, comment='Llave foránea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foránea a la tabla de estado')

    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )

    # Relaciones
    persona = relationship('Persona', back_populates='usuarios')
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado])
    modulos_creados = relationship('Modulo', back_populates='usr_creacion_rel', foreign_keys='Modulo.usr_creacion')
    menus_navegacion_creados = relationship('MenuNavegacion', back_populates='usr_creacion_rel', foreign_keys='MenuNavegacion.usr_creacion')
    roles_asignados = relationship('Roles', back_populates='usuario', foreign_keys='Roles.id_usuario')
    roles_creados = relationship('Roles', back_populates='usr_creacion_rel', foreign_keys='Roles.usr_creacion')
    roles_modificados = relationship('Roles', back_populates='usr_modificacion_rel', foreign_keys='Roles.usr_modificacion')
    pedidos = relationship('Pedido', back_populates='usuario')

    def __repr__(self):
        return (
            f"<Usuario(id_usuario={self.id_usuario}, "
            f"usuario='{self.usuario}', "
            f"puesto='{self.puesto}', "
            f"id_persona={self.id_persona}, "
            f"fecha_creacion='{self.fecha_creacion}', "
            f"id_estado={self.id_estado}, "
            f"id_tipo_estado={self.id_tipo_estado})>"
        )