import bcrypt
from models.usuario import Usuario
from models.roles import Roles

class FuncionesController:
    
    @staticmethod
    def creapass(password):
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        return hashed_password.decode('utf-8')

 
    @staticmethod
    def verificar_password(password, hashed_password):

        password_bytes = password.encode('utf-8')
        hashed_password_bytes = hashed_password.encode('utf-8')
        print("Contraseña ingresada:", password_bytes)
        print("Hash almacenado:", hashed_password_bytes)
        return bcrypt.checkpw(password_bytes, hashed_password_bytes)
    
    @staticmethod
    def get_usuario_by_id(user_id):

        usuario = Usuario.query.filter_by(
            id_usuario=user_id,
            id_estado=1
        ).first()
        return usuario

    @staticmethod
    def get_roles_usuario(user_id):
        try:
            roles = Roles.query.filter_by(
                id_usuario=user_id,
                id_estado=1 
            ).all()
            return roles
        except Exception as e:
            print("Error al obtener roles del usuario:", str(e))  
            return []
