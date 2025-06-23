from flask import request, jsonify
from models.usuario import Usuario
from models.menu_navegacion import MenuNavegacion
from models.roles import Roles
from models.persona import Persona
from models.conexion_db import db
from ....core.funciones_controller import FuncionesController
from sqlalchemy.orm import joinedload
from flask_jwt_extended import get_jwt_identity
from sqlalchemy.sql import func

class ConfiguracionController(FuncionesController):
    
    @staticmethod
    def obtener_usuarios():
        try:
            usuarios = Usuario.query.filter(Usuario.id_estado == 1).all()
            usuarios_serializados = [
                {
                    "id_usuario": usuario.id_usuario,
                    "usuario": usuario.usuario,
                    "nombres": usuario.persona.nombres,
                    "apellidos": usuario.persona.apellidos,
                    "telefono": usuario.persona.telefono if usuario.persona else None,
                    "direccion": usuario.persona.direccion if usuario.persona else None,
                    "puesto": usuario.puesto,
                    "fecha_creacion": usuario.fecha_creacion.strftime('%Y-%m-%d %H:%M:%S') 
                }
                for usuario in usuarios
            ]
            return jsonify(usuarios_serializados), 200
        except Exception as e:
            print("Error al obtener usuarios:", str(e))
            return jsonify({"msg": "Error al obtener usuarios", "error": str(e)}), 500
        
    @staticmethod
    def crear_usuario():
        try:
            data = request.get_json()
            hashed_password = FuncionesController.creapass(data['clave'])
            nueva_persona = Persona(
                nombres=data['nombres'],
                apellidos=data['apellidos'],
                telefono=data.get('telefono'),
                direccion=data.get('direccion'),
                id_estado=1
            )
            db.session.add(nueva_persona)
            db.session.commit()
            nuevo_usuario = Usuario(
                usuario=data['usuario'],
                clave=hashed_password,
                id_persona=nueva_persona.id_persona,
                puesto=data['puesto'],
                id_estado=1
            )
            db.session.add(nuevo_usuario)
            db.session.commit()
            return jsonify({"msg": "Usuario creado exitosamente"}), 201
        except Exception as e:
            db.session.rollback()
            print("Error al crear usuario:", str(e))
            return jsonify({"msg": "Error al crear usuario", "error": str(e)}), 500
        
    @staticmethod
    def actualizar_usuario(id_usuario):
        try:
            data = request.get_json()
            usuario = Usuario.query.filter_by(id_usuario=id_usuario, id_estado=1).first()
            if not usuario:
                return jsonify({"msg": "Usuario no encontrado"}), 404
            usuario.usuario = data.get('usuario', usuario.usuario)
            usuario.puesto = data.get('puesto', usuario.puesto)
            if 'clave' in data and data['clave']:
                hashed_password = FuncionesController.creapass(data['clave'])
                usuario.clave = hashed_password
            if usuario.persona:
                usuario.persona.nombres = data.get('nombres', usuario.persona.nombres)
                usuario.persona.apellidos = data.get('apellidos', usuario.persona.apellidos)
                usuario.persona.telefono = data.get('telefono', usuario.persona.telefono)
                usuario.persona.direccion = data.get('direccion', usuario.persona.direccion)
            db.session.commit()
            return jsonify({"msg": "Usuario actualizado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al actualizar usuario:", str(e))
            return jsonify({"msg": "Error al actualizar usuario", "error": str(e)}), 500

    @staticmethod
    def eliminar_usuario(id_usuario):
        try:
            usuario = Usuario.query.filter_by(id_usuario=id_usuario, id_estado=1).first()
            if not usuario:
                return jsonify({"msg": "Usuario no encontrado"}), 404
            usuario.id_estado = 0
            db.session.commit()
            return jsonify({"msg": "Usuario eliminado exitosamente"}), 200
        except Exception as e:
            print("Error al eliminar usuario:", str(e))
            return jsonify({"msg": "Error al eliminar usuario", "error": str(e)}), 500

    @staticmethod
    def obtener_roles_usuario(id_usuario):
        try:
            roles = Roles.query.options(
                joinedload(Roles.menu_navegacion).joinedload(MenuNavegacion.modulo)
            ).filter_by(
                id_usuario=id_usuario,
                id_estado=1
            ).all()
            if not roles:
                return jsonify({"msg": "No se encontraron roles para el usuario"}), 404
            roles_serializados = [
                {
                    "id_rol": rol.id_rol,
                    "id_menu_navegacion": rol.id_menu_navegacion,
                    "nombre_menu": rol.menu_navegacion.nombre_menu_navegacion if rol.menu_navegacion else None,
                    "url_menu": rol.menu_navegacion.url_menu if rol.menu_navegacion else None,
                    "id_modulo": rol.menu_navegacion.modulo.id_modulo if rol.menu_navegacion and rol.menu_navegacion.modulo else None,
                    "nombre_modulo": rol.menu_navegacion.modulo.nombre_modulo if rol.menu_navegacion and rol.menu_navegacion.modulo else None,
                    "fecha_creacion": rol.fecha_creacion.strftime('%Y-%m-%d %H:%M:%S') if rol.fecha_creacion else None
                }
                for rol in roles
            ]
            return jsonify(roles_serializados), 200
        except Exception as e:
            print("Error al obtener roles del usuario:", str(e))
            return jsonify({"msg": "Error al obtener roles del usuario", "error": str(e)}), 500

    @staticmethod
    def asignar_roles_usuario():
        try:
            data = request.get_json()
            id_usuario = data.get('id_usuario')
            id_menu_navegacion = data.get('id_menu_navegacion')
            usuario = Usuario.query.filter_by(id_usuario=id_usuario, id_estado=1).first()
            if not usuario:
                return jsonify({"msg": "Usuario no encontrado"}), 404
            menu = MenuNavegacion.query.filter_by(id_menu_navegacion=id_menu_navegacion, id_estado=1).first()
            if not menu:
                return jsonify({"msg": "Menú de navegación no encontrado"}), 404
            nuevo_rol = Roles(
                id_usuario=id_usuario,
                id_menu_navegacion=id_menu_navegacion,
                usr_creacion=get_jwt_identity(),
                id_estado=1
            )
            db.session.add(nuevo_rol)
            db.session.commit()
            return jsonify({"msg": "Rol asignado exitosamente"}), 201
        except Exception as e:
            db.session.rollback()
            print("Error al asignar rol al usuario:", str(e))
            return jsonify({"msg": "Error al asignar rol al usuario", "error": str(e)}), 500
        
    @staticmethod
    def eliminar_rol_usuario(id_rol):
        try:
            rol = Roles.query.filter_by(id_rol=id_rol, id_estado=1).first()
            if not rol:
                return jsonify({"msg": "Rol no encontrado"}), 404
            rol.id_estado = 0
            rol.fecha_baja = func.now()
            rol.usr_modificacion = get_jwt_identity()
            db.session.commit()
            return jsonify({"msg": "Rol eliminado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al quitar rol del usuario:", str(e))
            return jsonify({"msg": "Error al quitar rol del usuario", "error": str(e)}), 500

    @staticmethod
    def obtener_modulos():
        try:
            user_id = get_jwt_identity()
            print("Token recibido, ID del usuario autenticado:", user_id)
            if not user_id:
                return jsonify({"msg": "No se pudo obtener el usuario autenticado"}), 401
            roles = Roles.query.options(
                joinedload(Roles.menu_navegacion).joinedload(MenuNavegacion.modulo)
            ).filter_by(
                id_usuario=user_id,
                id_estado=1
            ).all()
            if not roles:
                return jsonify({"msg": "No se encontraron roles para el usuario"}), 404
            modulos = {}
            for rol in roles:
                menu = rol.menu_navegacion
                if menu and menu.modulo:
                    modulo = menu.modulo
                    if modulo.id_modulo not in modulos:
                        modulos[modulo.id_modulo] = {
                            "id_modulo": modulo.id_modulo,
                            "nombre_modulo": modulo.nombre_modulo,
                            "menus": []
                        }
                    modulos[modulo.id_modulo]["menus"].append({
                        "id_menu": menu.id_menu_navegacion,
                        "nombre_menu": menu.nombre_menu_navegacion,
                        "url_menu": menu.url_menu
                    })
            modulos_serializados = list(modulos.values())
            return jsonify(modulos_serializados), 200
        except Exception as e:
            print("Error al obtener módulos:", str(e))
            return jsonify({"msg": "Error al obtener módulos", "error": str(e)}), 500
        
    @staticmethod
    def obtener_menus():
        try:
            menus = MenuNavegacion.query.filter_by(id_estado=1).order_by(MenuNavegacion.id_menu_navegacion).all()
            if not menus:
                return jsonify({"msg": "No se encontraron menús disponibles"}), 404
            menus_serializados = [
                {
                    "id_menu": menu.id_menu_navegacion,
                    "nombre_menu": menu.nombre_menu_navegacion,
                    "url_menu": menu.url_menu
                }
                for menu in menus
            ]
            return jsonify(menus_serializados), 200
        except Exception as e:
            print("Error al obtener menús:", str(e))
            return jsonify({"msg": "Error al obtener menús", "error": str(e)}), 500
        
    @staticmethod
    def obtener_modulos():
        try:
            user_id = get_jwt_identity()
            print("Token recibido, ID del usuario autenticado:", user_id) 

            if not user_id:
                return jsonify({"msg": "No se pudo obtener el usuario autenticado"}), 401

            roles = Roles.query.options(
                joinedload(Roles.menu_navegacion).joinedload(MenuNavegacion.modulo)
            ).filter_by(
                id_usuario=user_id,
                id_estado=1  
            ).all()

            if not roles:
                return jsonify({"msg": "No se encontraron roles para el usuario"}), 404

            modulos = {}
            for rol in roles:
                menu = rol.menu_navegacion
                if menu and menu.modulo:
                    modulo = menu.modulo
                    if modulo.id_modulo not in modulos:
                        modulos[modulo.id_modulo] = {
                            "id_modulo": modulo.id_modulo,
                            "nombre_modulo": modulo.nombre_modulo,
                            "menus": []
                        }
                    modulos[modulo.id_modulo]["menus"].append({
                        "id_menu": menu.id_menu_navegacion,
                        "nombre_menu": menu.nombre_menu_navegacion,
                        "url_menu": menu.url_menu
                    })

            modulos_serializados = list(modulos.values())

            return jsonify(modulos_serializados), 200
        except Exception as e:
            print("Error al obtener módulos:", str(e))  # Log para depuración
            return jsonify({"msg": "Error al obtener módulos", "error": str(e)}), 500
        
    @staticmethod
    def obtener_menus():
        try:
            menus = MenuNavegacion.query.filter_by(id_estado=1).order_by(MenuNavegacion.id_menu_navegacion).all()

            if not menus:
                return jsonify({"msg": "No se encontraron menús disponibles"}), 404

            menus_serializados = [
                {
                    "id_menu": menu.id_menu_navegacion,
                    "nombre_menu": menu.nombre_menu_navegacion,
                    "url_menu": menu.url_menu
                }
                for menu in menus
            ]

            # Retornar el listado de menús
            return jsonify(menus_serializados), 200
        except Exception as e:
            print("Error al obtener menús:", str(e))
            return jsonify({"msg": "Error al obtener menús", "error": str(e)}), 500

