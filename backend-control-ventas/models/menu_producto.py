from .conexion_db import db 
from sqlalchemy.orm import relationship

class MenuProducto(db.Model):
    __tablename__ = 'menu_producto'
    
    id_menu_producto = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='Llave primaria de la tabla menu_producto')
    id_menu_escolar = db.Column(db.Integer, db.ForeignKey('menu_escolar.id_menu_escolar'), nullable=False, comment='Llave foranea a la tabla de menu_escolar')
    id_producto = db.Column(db.Integer, db.ForeignKey('producto.id_producto'), nullable=False, comment='Llave foranea a la tabla de producto')
    id_tipo_estado = db.Column(db.Integer, nullable=False, default=12, comment='Llave foranea a la tabla de estado')
    id_estado = db.Column(db.Integer, nullable=False, default=1, comment='Llave foranea a la tabla de estado')
    
    # Clave compuesta para el FK
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['id_estado', 'id_tipo_estado'],
            ['estado.id_estado', 'estado.id_tipo_estado']
        ),
    )
    
    # Relaciones
    estado = relationship('Estado', foreign_keys=[id_estado, id_tipo_estado], back_populates='menu_productos')
    menu_escolar = relationship('MenuEscolar', back_populates='menu_productos')
    producto = relationship('Producto', back_populates='menu_productos')
    
    def __repr__(self):
        return f"<MenuProducto(id_menu_producto={self.id_menu_producto}, id_menu_escolar={self.id_menu_escolar}, id_producto={self.id_producto}, precio_venta={self.precio_venta})>"
