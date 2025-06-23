from flask import session, request, jsonify
from models.usuario import Usuario
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity
from controllers.core.funciones_controller import FuncionesController

class LoginController:
    

    @staticmethod
    def validar_login():

        data = request.get_json()

        if not data:
            return jsonify({"msg": "No se enviaron datos en la solicitud"}), 400

        usuario_input = data.get("txtUsr")
        clave_input = data.get("txtPass")

        if not usuario_input or not clave_input:
            return jsonify({"msg": "Usuario y clave son requeridos"}), 400

        usuario = Usuario.query.filter_by(usuario=usuario_input).first()

        if not usuario:
            return jsonify({"msg": "Usuario no encontrado"}), 404


        if not FuncionesController.verificar_password(clave_input, usuario.clave):
            return jsonify({"msg": "Clave incorrecta"}), 403

        # Crear token JWT
        access_token = create_access_token(identity=str(usuario.id_usuario))
        return jsonify({
            "msg": "Inicio de sesión exitoso",
            "access_token": access_token,
            "usuario": usuario.usuario,
            "puesto": usuario.puesto,
            "id_usuario": usuario.id_usuario
        }), 200

    @staticmethod
    @jwt_required()
    def check_sistema_user():
     
        user_id = get_jwt_identity()

        if not user_id:
            return {"msg": "Token inválido o usuario no autenticado", "tipo": "error"}, 401

        usuario = FuncionesController.get_usuario_by_id(int(user_id))  

        if not usuario:
            return {"msg": "Usuario no encontrado", "tipo": "error"}, 404

        usuario_serializado = {
            "id_usuario": usuario.id_usuario,
            "nombres": usuario.persona.nombres,
            "apellidos": usuario.persona.apellidos,
            "roles": [
                {
                    "id_rol": rol.id_rol,
                    "nombre_rol": rol.menu_navegacion.nombre_menu_navegacion if rol.menu_navegacion else "Sin nombre"
                }
                for rol in usuario.roles_asignados
            ]
        }

        return {
            "msg": "Usuario autenticado",
            "tipo": "success",
            "usuario": usuario_serializado
        }, 200


    @staticmethod
    def salir():
        session.clear()
        return {"msg": "Finalización de Sesión", "tipo": "warning"}, 200