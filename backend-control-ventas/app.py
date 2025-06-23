from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv
from models.conexion_db import init_db
from controllers.validacion.login_controller import LoginController
from utils.mensajes import MENSAJES
from controllers.sistema.modulo.configuacion.configuracion_controller import ConfiguracionController
from controllers.sistema.modulo.ControlVentas.control_ventas_controller import ControlVentasController

env_file = '.env.production' if os.getenv("FLASK_ENV") == "production" else '.env.development'
load_dotenv(env_file)

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "clave-secreta-predeterminada")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "20000"))
app.secret_key = os.getenv("SECRET_KEY", "clave-secreta-predeterminada")

app.config["ENV"] = os.getenv("FLASK_ENV", "development")

cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

jwt = JWTManager(app)

init_db(app)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "msg": MENSAJES["TOKEN_EXPIRADO"],
        "tipo": "error"
    }), 401

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({
        "msg": MENSAJES["TOKEN_FALTANTE"],
        "tipo": "error"
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        "msg": MENSAJES["TOKEN_INVALIDO"],
        "tipo": "error"
    }), 401

@app.route('/api/test-token', methods=['GET'])
@jwt_required()
def test_token():
    current_user = get_jwt_identity()
    return jsonify({"msg": "Token válido", "user_id": current_user}), 200

@app.route('/api/login', methods=['POST'])
def validar_login():
    return LoginController.validar_login()

@app.route('/api/salir', methods=['POST'])
def salir():
    return jsonify(LoginController.salir())

@app.route('/api/modulos', methods=['GET'])
@jwt_required()
def obtener_modulos():
    return ConfiguracionController.obtener_modulos()

@app.route('/api/check_user', methods=['GET'])
def check_sistema_user():
    return jsonify(LoginController.check_sistema_user())

@app.route('/api/usuarios', methods=['GET'])
@jwt_required()
def obtener_usuarios():
    return ConfiguracionController.obtener_usuarios()

@app.route('/api/crear_usuario', methods=['POST'])
@jwt_required()
def crear_usuario():
    return ConfiguracionController.crear_usuario()

@app.route('/api/actualizar_usuario/<int:id_usuario>', methods=['PUT'])
@jwt_required()
def actualizar_usuario(id_usuario):
    return ConfiguracionController.actualizar_usuario(id_usuario)

@app.route('/api/eliminar_usuario/<int:id_usuario>', methods=['DELETE'])
@jwt_required()
def eliminar_usuario(id_usuario):
    return ConfiguracionController.eliminar_usuario(id_usuario)

@app.route('/api/obtener_roles/<int:id_usuario>', methods=['GET'])
@jwt_required()
def obtener_roles_usuario(id_usuario):
    return ConfiguracionController.obtener_roles_usuario(id_usuario)

@app.route('/api/asignar_roles', methods=['POST'])
@jwt_required()
def asignar_roles_usuario():
    return ConfiguracionController.asignar_roles_usuario()

@app.route('/api/obtener_menus', methods=['GET'])
@jwt_required()
def obtener_menus():
    return ConfiguracionController.obtener_menus()

@app.route('/api/eliminar_rol/<int:id_rol>', methods=['DELETE'])
@jwt_required()
def eliminar_rol_usuario(id_rol):
    return ConfiguracionController.eliminar_rol_usuario(id_rol)

@app.route('/api/obtener_categorias', methods=['GET'])
@jwt_required()
def obtener_categorias():
    return ControlVentasController.obtener_categorias()

@app.route('/api/crear_categoria', methods=['POST'])
@jwt_required()
def crear_categoria():
    return ControlVentasController.crear_categoria()

@app.route('/api/actualizar_categoria/<int:id_categoria>', methods=['PUT'])
@jwt_required()
def actualizar_categoria(id_categoria):
    return ControlVentasController.actualizar_categoria(id_categoria)

@app.route('/api/eliminar_categoria/<int:id_categoria>', methods=['DELETE'])
@jwt_required()
def eliminar_categoria(id_categoria):
    return ControlVentasController.eliminar_categoria(id_categoria)

@app.route('/api/obtener_productos', methods=['GET'])
@jwt_required()
def obtener_productos():
    return ControlVentasController.obtener_productos()

@app.route('/api/obtener_productos_sin_paginacion', methods=['GET'])
@jwt_required()
def obtener_productos_sin_paginacion():
    return ControlVentasController.obtener_productos_sin_paginacion()

@app.route('/api/crear_producto', methods=['POST'])
@jwt_required()
def crear_producto():
    return ControlVentasController.crear_producto()

@app.route('/api/actualizar_producto/<int:id_producto>', methods=['PUT'])
@jwt_required()
def actualizar_producto(id_producto):
    return ControlVentasController.actualizar_producto(id_producto)

@app.route('/api/eliminar_producto/<int:id_producto>', methods=['DELETE'])
@jwt_required()
def eliminar_producto(id_producto):
    return ControlVentasController.eliminar_producto(id_producto)

@app.route('/api/obtener_tipo_menus', methods=['GET'])
@jwt_required()
def obtener_tipo_menus():
    return ControlVentasController.obtener_tipo_menus()

@app.route('/api/crear_tipo_menu', methods=['POST'])
@jwt_required()
def crear_tipo_menu():
    return ControlVentasController.crear_tipo_menu()

@app.route('/api/actualizar_tipo_menu/<int:id_tipo_menu>', methods=['PUT'])
@jwt_required()
def actualizar_tipo_menu(id_tipo_menu):
    return ControlVentasController.actualizar_tipo_menu(id_tipo_menu)

@app.route('/api/eliminar_tipo_menu/<int:id_tipo_menu>', methods=['DELETE'])
@jwt_required()
def eliminar_tipo_menu(id_tipo_menu):
    return ControlVentasController.eliminar_tipo_menu(id_tipo_menu)

@app.route('/api/obtener_niveles_educativos', methods=['GET'])
@jwt_required()
def obtener_niveles_educativos():
    return ControlVentasController.obtener_niveles_educativos()

@app.route('/api/crear_nivel_educativo', methods=['POST'])
@jwt_required()
def crear_nivel_educativo():
    return ControlVentasController.crear_nivel_educativo()

@app.route('/api/actualizar_nivel_educativo/<int:id_nivel_educativo>', methods=['PUT'])
@jwt_required()
def actualizar_nivel_educativo(id_nivel_educativo):
    return ControlVentasController.actualizar_nivel_educativo(id_nivel_educativo)

@app.route('/api/eliminar_nivel_educativo/<int:id_nivel_educativo>', methods=['DELETE'])
@jwt_required()
def eliminar_nivel_educativo(id_nivel_educativo):
    return ControlVentasController.eliminar_nivel_educativo(id_nivel_educativo)

@app.route('/api/obtener_menus_con_productos', methods=['GET'])
@jwt_required()
def obtener_menus_productos():
    return ControlVentasController.obtener_menus_con_productos()

@app.route('/api/crear_menu_escolar', methods=['POST'])
@jwt_required()
def crear_menu_escolar():
    return ControlVentasController.crear_menu_escolar()

@app.route('/api/agregar_producto_a_menu/<int:id_menu_escolar>', methods=['POST'])
@jwt_required()
def agregar_producto_a_menu(id_menu_escolar):
    return ControlVentasController.agregar_producto_a_menu(id_menu_escolar)

@app.route('/api/actualizar_menu_escolar/<int:id_menu_escolar>', methods=['PUT'])
@jwt_required()
def actualizar_menu_escolar(id_menu_escolar):
    return ControlVentasController.actualizar_menu_escolar(id_menu_escolar)

@app.route('/api/eliminar_menu_productos/<int:id_menu_escolar>', methods=['DELETE'])
@jwt_required()
def eliminar_menu_producto(id_menu_escolar):
    return ControlVentasController.eliminar_menu_producto(id_menu_escolar)

@app.route('/api/eliminar_producto_de_menu/<int:id_menu_producto>', methods=['DELETE'])
@jwt_required()
def eliminar_producto_de_menuu(id_menu_producto):
    return ControlVentasController.eliminar_producto_de_menu(id_menu_producto)

@app.route('/api/obtener_escuelas', methods=['GET'])
@jwt_required()
def obtener_escuelas():
    return ControlVentasController.obtener_escuelas()

@app.route('/api/crear_escuela', methods=['POST'])
@jwt_required()
def crear_escuela():
    return ControlVentasController.crear_escuela()

@app.route('/api/actualizar_escuela/<int:id_escuela>', methods=['PUT'])
@jwt_required()
def actualizar_escuela(id_escuela):
    return ControlVentasController.actualizar_escuela(id_escuela)

@app.route('/api/eliminar_escuela/<int:id_escuela>', methods=['DELETE'])
@jwt_required()
def eliminar_escuela(id_escuela):
    return ControlVentasController.eliminar_escuela(id_escuela)

@app.route('/api/obtener_pedidos_recientes', methods=['GET'])
@jwt_required()
def pedidos_recientes():
    return ControlVentasController.obtener_pedidos_recientes()

@app.route('/api/obtener_historial_pedidos', methods=['GET'])
@jwt_required()
def historial_pedidos():
    return ControlVentasController.obtener_historial_pedidos()

@app.route('/api/crear_pedido', methods=['POST'])
@jwt_required()
def crear_pedido():
    return ControlVentasController.crear_pedido()

@app.route('/api/actualizar_pedido/<int:id_pedido>', methods=['PUT'])
@jwt_required()
def actualizar_pedido(id_pedido):
    return ControlVentasController.actualizar_pedido(id_pedido)

@app.route('/api/eliminar_pedido_productos/<int:id_pedido>', methods=['DELETE'])
@jwt_required()
def eliminar_pedido_productos(id_pedido):
    return ControlVentasController.eliminar_pedido_productos(id_pedido)

@app.route('/api/obtener_productos_pedido/<int:id_pedido>', methods=['GET'])
@jwt_required()
def obtener_productos_pedido(id_pedido):
    return ControlVentasController.obtener_productos_pedido(id_pedido)

@app.route('/api/agregar_producto_pedido/<int:id_pedido>', methods=['POST'])
@jwt_required()
def agregar_producto_pedido(id_pedido):
    return ControlVentasController.agregar_producto_pedido(id_pedido)

@app.route('/api/actualizar_producto_pedido/<int:id_pedido_producto>', methods=['PUT'])
@jwt_required()
def actualizar_producto_pedido(id_pedido_producto):
    return ControlVentasController.actualizar_producto_pedido(id_pedido_producto)

@app.route('/api/eliminar_producto_pedido/<int:id_pedido_producto>', methods=['DELETE'])
@jwt_required()
def eliminar_producto_pedido(id_pedido_producto):
    return ControlVentasController.eliminar_producto_pedido(id_pedido_producto)

@app.route('/api/obtener_semanas_pedidos', methods=['GET'])
@jwt_required()
def obtener_semanas_pedidos():
    return ControlVentasController.obtener_semanas_pedidos()

@app.route('/api/total_semana_pedido', methods=['GET'])
@jwt_required()
def total_semana_pedido():
    return ControlVentasController.total_semana_pedido()

@app.route('/api/obtener_historial_semanas_pedidos', methods=['GET'])
@jwt_required()
def obtener_historial_semanas_pedidos():
    return ControlVentasController.obtener_historial_semanas_pedidos()

@app.route('/api/cerrar_semana_pedido/<int:id_semana_pedido>', methods=['PUT'])
@jwt_required()
def cerrar_semana_pedido(id_semana_pedido):
    return ControlVentasController.cerrar_semana_pedido(id_semana_pedido)

@app.route('/api/reabrir_semana_y_pedidos/<int:id_semana_pedido>', methods=['PUT'])
@jwt_required()
def reabrir_semana_y_pedidos(id_semana_pedido):
    return ControlVentasController.reabrir_semana_y_pedidos(id_semana_pedido)

@app.route('/api/crear_semana_pedido', methods=['POST'])
@jwt_required()
def crear_semana_pedido():
    return ControlVentasController.crear_semana_pedido()

@app.route('/api/actualizar_semana_pedido/<int:id_semana_pedido>', methods=['PUT'])
@jwt_required()
def actualizar_semana_pedido(id_semana_pedido):
    return ControlVentasController.actualizar_semana_pedido(id_semana_pedido)

@app.route('/api/eliminar_semana_pedido/<int:id_semana_pedido>', methods=['DELETE'])
@jwt_required()
def eliminar_semana_pedido(id_semana_pedido):
    return ControlVentasController.eliminar_semana_pedido(id_semana_pedido)

@app.route('/api/informe_detallado_semana_pedido', methods=['GET'])
@jwt_required()
def informe_detallado_semana_pedido():
    return ControlVentasController.informe_detallado_semana_pedido()

if __name__ == "__main__":
    port = int(os.getenv("APP_PORT", default=5000))
    debug_mode = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
