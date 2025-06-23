from flask import request, jsonify
from models.categoria import Categoria
from models.producto import Producto
from models.conexion_db import db
from models.nivel_educativo import NivelEducativo
from models.tipo import Tipo
from models.menu_escolar import MenuEscolar
from models.menu_producto import MenuProducto
from models.pedido import Pedido
from models.pedido_producto import PedidoProducto
from models.escuela import Escuela
from models.menu_escolar import MenuEscolar
from models.semana_pedido import SemanaPedido
from sqlalchemy import func
from datetime import datetime




class ControlVentasController:


    @staticmethod
    def obtener_categorias():
        try:
            categorias = Categoria.query.filter_by(id_estado=1).all()
            
            if not categorias: 
                return jsonify({"msg" : "No se encontraron categorias disponibles"}), 404
            
            categorias_serializadas = [
                {
                    "id_categoria": categoria.id_categoria,
                    "nombre_categoria": categoria.nombre_categoria
                    
                }
                for categoria in categorias 
            ]
            
            return jsonify(categorias_serializadas), 200
        
        
        except Exception as e:
            print("Error al obtener categorías:", str(e))
            return jsonify({"msg": "Error al obtener categorías", "error": str(e)}), 500


    @staticmethod 
    def crear_categoria():
        try:
            data = request.get_json()

            categoria_existente = Categoria.query.filter_by(nombre_categoria=data['nombre_categoria'], id_estado=1).first()
            if categoria_existente:
                return jsonify({"msg": "La categoría ya existe"}), 409

            nueva_categoria = Categoria(
                nombre_categoria=data['nombre_categoria'],
                id_estado=1
            )
            db.session.add(nueva_categoria) 
            db.session.commit() 
            return jsonify({"msg": "Categoría creada exitosamente"}), 201
            
        except Exception as e:
            db.session.rollback()
            print("Error al crear categoria:", str(e))
            return jsonify({"msg": "Error al crear categoria", "error": str(e)}), 500
        
    @staticmethod
    def actualizar_categoria(id_categoria):
        try:
            data = request.get_json()
            
            categoria = Categoria.query.filter_by(id_categoria=id_categoria, id_estado=1).first()
            print("Categoría encontrada:", categoria) 
            if not categoria:
                return jsonify({"msg": "Categoría no encontrada"}), 404
            
            categoria.nombre_categoria = data.get('nombre_categoria', categoria.nombre_categoria)
            
            db.session.commit()
            return jsonify({"msg": "Categoría actualizada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al actualizar categoria:", str(e))
            return jsonify({"msg": "Error al actualizar categoria", "error": str(e)}), 500
        
        
    @staticmethod
    def eliminar_categoria(id_categoria):
        try:
            productos_asociados = Producto.query.filter_by(id_categoria=id_categoria, id_estado=1).all()
            if productos_asociados:
                return jsonify({"msg": "No se puede eliminar la categoría porque tiene productos asociados"}), 400

            categoria = Categoria.query.filter_by(id_categoria=id_categoria, id_estado=1).first()
            if not categoria:
                return jsonify({"msg": "Categoría no encontrada"}), 404

            categoria.id_estado = 0
            db.session.commit()

            return jsonify({"msg": "Categoría eliminada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar categoría:", str(e))
            return jsonify({"msg": "Error al eliminar categoría", "error": str(e)}), 500




    @staticmethod
    def obtener_productos():
        try:
            page = request.args.get("page", default=1, type=int)
            per_page = request.args.get("per_page", default=20, type=int)
            nombre_producto = request.args.get("nombre_producto", type=str)

            query = Producto.query.filter_by(id_estado=1)
            if nombre_producto:
                query = query.filter(Producto.nombre_producto.ilike(f"%{nombre_producto}%"))
            query = query.order_by(Producto.id_producto)

            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            productos = pagination.items

            if not productos:
                return jsonify({"msg": "No se encontraron productos disponibles"}), 404

            productos_serializados = [
                {
                    "id_producto": producto.id_producto,
                    "nombre_producto": producto.nombre_producto,
                    "precio_venta": float(producto.precio_venta),
                    "id_categoria": producto.id_categoria,
                    "nombre_categoria": producto.categoria.nombre_categoria
                }
                for producto in productos
            ]

            return jsonify({
                "productos": productos_serializados,
                "total": pagination.total,
                "pages": pagination.pages,
                "page": page
            }), 200

        except Exception as e:
            print("Error al obtener productos:", str(e))
            return jsonify({"msg": "Error al obtener productos", "error": str(e)}), 500
        

    @staticmethod
    def obtener_productos_sin_paginacion():
        try:
            nombre_producto = request.args.get("nombre_producto", type=str)

            query = Producto.query.filter_by(id_estado=1)
            if nombre_producto:
                query = query.filter(Producto.nombre_producto.ilike(f"%{nombre_producto}%"))
            query = query.order_by(Producto.id_producto)

            productos = query.all()

            if not productos:
                return jsonify({"msg": "No se encontraron productos disponibles"}), 404
            productos_serializados = [
                {
                    "id_producto": producto.id_producto,
                    "nombre_producto": producto.nombre_producto,
                    "precio_venta": float(producto.precio_venta),
                    "id_categoria": producto.id_categoria,
                    "nombre_categoria": producto.categoria.nombre_categoria
                }
                for producto in productos
            ]

            return jsonify({"productos": productos_serializados}), 200

        except Exception as e:
            print("Error al obtener productos:", str(e))
            return jsonify({"msg": "Error al obtener productos", "error": str(e)}), 500
        
    @staticmethod
    def crear_producto():
        try:
            data = request.get_json()

            nombre_producto = data.get('nombre_producto')
            precio_venta = data.get('precio_venta')
            id_categoria = data.get('id_categoria')

            if (
                not nombre_producto or
                precio_venta is None or
                str(precio_venta).strip() == "" or
                not id_categoria
            ):
                return jsonify({"msg": "Faltan datos obligatorios"}), 400

            try:
                precio_venta = float(precio_venta)
                if precio_venta < 0:
                    raise ValueError
            except Exception:
                return jsonify({"msg": "El precio de venta debe ser un número positivo"}), 400

            producto_existente = Producto.query.filter_by(nombre_producto=nombre_producto, id_estado=1).first()
            if producto_existente:
                return jsonify({"msg": "El producto ya existe"}), 409

            categoria = Categoria.query.filter_by(id_categoria=id_categoria, id_estado=1).first()
            if not categoria:
                return jsonify({"msg": "La categoría no existe o está inactiva"}), 404

            id_tipo_estado = data.get('id_tipo_estado', 8)  
           
            nuevo_producto = Producto(
                nombre_producto=nombre_producto,
                precio_venta=precio_venta,
                id_categoria=id_categoria,
                id_tipo_estado=id_tipo_estado,
                id_estado=1,
            )

            db.session.add(nuevo_producto)
            db.session.commit()

            return jsonify({"msg": "Producto creado exitosamente"}), 201

        except Exception as e:
            db.session.rollback()
            print("Error al crear producto:", str(e))
            return jsonify({"msg": "Error al crear producto", "error": str(e)}), 500
        
    @staticmethod
    def actualizar_producto(id_producto):
        try:
            data = request.get_json()
            
            producto = Producto.query.filter_by(id_producto=id_producto, id_estado=1).first()
            if not producto:
                return jsonify({"msg": "Producto no encontrado"}), 404
            
            categoria = Categoria.query.filter_by(id_categoria=data['id_categoria'], id_estado=1).first()
            if not categoria:
                return jsonify({"msg": "La categoría no existe o está inactiva"}), 404
            
            producto.nombre_producto = data.get('nombre_producto', producto.nombre_producto)
            producto.precio_venta = data.get('precio_venta', producto.precio_venta)
            producto.id_categoria = data.get('id_categoria', producto.id_categoria) 
            
            db.session.commit()
            return jsonify({"msg": "Producto actualizado exitosamente"}), 200
        
        except Exception as e:
            db.session.rollback()
            print("Error al actualizar producto:", str(e))
            return jsonify({"msg": "Error al actualizar producto", "error": str(e)}), 500
        
        
    @staticmethod
    def eliminar_producto(id_producto):
        try:
            menus_asociados = MenuProducto.query.filter_by(id_producto=id_producto, id_estado=1).all()
            if menus_asociados:
                return jsonify({"msg": "No se puede eliminar el producto porque tiene menús asociados"}), 400
            
            producto = Producto.query.filter_by(id_producto=id_producto, id_estado=1).first()
            if not producto:
                return jsonify({"msg": "Producto no encontrado"}), 404

            producto.id_estado = 0
            db.session.commit()

            return jsonify({"msg": "Producto eliminado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            
    
    @staticmethod
    def obtener_niveles_educativos():
        try:
            niveles_educativos = NivelEducativo.query.filter_by(id_estado=1).all()
            
            if not niveles_educativos:
                return jsonify({"msg": "No se encontraron niveles educativos disponibles"}), 404
            
          
            niveles_educativos_serializados = [
                {
                    "id_nivel_educativo": nivel.id_nivel_educativo,
                    "nombre_nivel": nivel.nombre_nivel
                }
                for nivel in niveles_educativos
            ]
            
            return jsonify(niveles_educativos_serializados), 200
        
        except Exception as e:
            print("Error al obtener niveles educativos:", str(e))
            return jsonify({"msg": "Error al obtener niveles educativos", "error": str(e)}), 500
        
    
    @staticmethod
    def crear_nivel_educativo():
        try:
            data = request.get_json()  
            
            nivel_existente = NivelEducativo.query.filter_by(nombre_nivel=data['nombre_nivel'], id_estado=1).first()
            if nivel_existente:
                return jsonify({"msg": "El nivel educativo ya existe"}), 409
            
            nuevo_nivel = NivelEducativo(
                nombre_nivel=data['nombre_nivel'],
                id_estado=1 
            )
            
            db.session.add(nuevo_nivel)  
            db.session.commit()  
            return jsonify({"msg": "Nivel educativo creado exitosamente"}), 201
        except Exception as e:
            db.session.rollback()  
            print("Error al crear nivel educativo:", str(e))
            return jsonify({"msg": "Error al crear nivel educativo", "error": str(e)}), 500
    
    @staticmethod
    def actualizar_nivel_educativo(id_nivel_educativo):
        try:
            data = request.get_json()
            
            nivel = NivelEducativo.query.filter_by(id_nivel_educativo=id_nivel_educativo, id_estado=1).first()
            if not nivel:
                return jsonify({"msg": "Nivel educativo no encontrado"}), 404
            
            nivel.nombre_nivel = data.get('nombre_nivel', nivel.nombre_nivel)
            
            db.session.commit()
            return jsonify({"msg": "Nivel educativo actualizado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al actualizar nivel educativo:", str(e))
            return jsonify({"msg": "Error al actualizar nivel educativo", "error": str(e)}), 500
        
    @staticmethod
    def eliminar_nivel_educativo(id_nivel_educativo):
        try:
            menus_asociados = MenuEscolar.query.filter_by(id_nivel_educativo=id_nivel_educativo, id_estado=1).all()
            if menus_asociados:
                return jsonify({"msg": "No se puede eliminar el nivel educativo porque tiene menús asociados"}), 400
            
            nivel = NivelEducativo.query.filter_by(id_nivel_educativo=id_nivel_educativo, id_estado=1).first()
            if not nivel:
                return jsonify({"msg": "Nivel educativo no encontrado"}), 404

            nivel.id_estado = 0
            db.session.commit()

            return jsonify({"msg": "Nivel educativo eliminado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar nivel educativo:", str(e))
            return jsonify({"msg": "Error al eliminar nivel educativo", "error": str(e)}), 500
        
        
    @staticmethod
    def obtener_tipo_menus():
        try:
            tipos_menus = Tipo.query.filter_by(id_estado=1).all()
            if not tipos_menus:
                return jsonify({"msg": "No se encontraron tipos de menú disponibles"}), 404
            tipos_menus_serializados = [
                {
                    "id_tipo": tipo.id_tipo,
                    "nombre_tipo": tipo.nombre_tipo
                }
                for tipo in tipos_menus 
            ]
            return jsonify(tipos_menus_serializados), 200
        except Exception as e:
            print("Error al obtener tipos de menú:", str(e))
            return jsonify({"msg": "Error al obtener tipos de menú", "error": str(e)}), 500
        
    @staticmethod
    def crear_tipo_menu():
        try:
            data = request.get_json()  
            
            tipo_existente = Tipo.query.filter_by(nombre_tipo=data['nombre_tipo'], id_estado=1).first()
            if tipo_existente:
                return jsonify({"msg": "El tipo de menú ya existe"}), 409
            
            nuevo_tipo = Tipo(
                nombre_tipo=data['nombre_tipo'],
                id_estado=1 
            )
            
            db.session.add(nuevo_tipo)  
            db.session.commit()  
            return jsonify({"msg": "Tipo de menú creado exitosamente"}), 201
        except Exception as e:
            db.session.rollback()  
            print("Error al crear tipo de menú:", str(e))
            return jsonify({"msg": "Error al crear tipo de menú", "error": str(e)}), 500
        
    @staticmethod
    def actualizar_tipo_menu(id_tipo):
        try:
            data = request.get_json()
            
            tipo = Tipo.query.filter_by(id_tipo=id_tipo, id_estado=1).first()
            if not tipo:
                return jsonify({"msg": "Tipo de menú no encontrado"}), 404
            
            tipo.nombre_tipo = data.get('nombre_tipo', tipo.nombre_tipo)
            
            db.session.commit()
            return jsonify({"msg": "Tipo de menú actualizado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al actualizar tipo de menú:", str(e))
            return jsonify({"msg": "Error al actualizar tipo de menú", "error": str(e)}), 500
        
    @staticmethod
    def eliminar_tipo_menu(id_tipo):
        try:
            menus_asociados = MenuEscolar.query.filter_by(id_tipo=id_tipo, id_estado=1).all()
            if menus_asociados:
                return jsonify({"msg": "No se puede eliminar el tipo de menú porque tiene menús asociados"}), 400
            
            tipo = Tipo.query.filter_by(id_tipo=id_tipo, id_estado=1).first()
            if not tipo:
                return jsonify({"msg": "Tipo de menú no encontrado"}), 404

            tipo.id_estado = 0
            db.session.commit()

            return jsonify({"msg": "Tipo de menú eliminado exitosamente"}), 200
        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar tipo de menú:", str(e))
            return jsonify({"msg": "Error al eliminar tipo de menú", "error": str(e)}), 500
        
        
        
        

    @staticmethod
    def obtener_menus_con_productos():
        try:
            numero_menu = request.args.get('numero_menu', type=str)

            query = MenuEscolar.query.filter_by(id_estado=1)
            if numero_menu and numero_menu.strip() != "":
                try:
                    query = query.filter(MenuEscolar.numero_menu == int(numero_menu))
                except ValueError:
                    query = query.filter(False)

            menus = query.order_by(MenuEscolar.numero_menu.asc()).all()

            if not menus:
                return jsonify({"msg": "No se encontraron menús disponibles"}), 404

            menus_serializados = []
            for menu in menus:
                productos = [
                    {
                        "id_menu_producto": mp.id_menu_producto,
                        "id_producto": mp.producto.id_producto,
                        "nombre_producto": mp.producto.nombre_producto,
                        "precio_venta": float(mp.producto.precio_venta),
                        "nombre_categoria": mp.producto.categoria.nombre_categoria
                    }
                    for mp in menu.menu_productos if mp.id_estado == 1
                ]

                tipo_menu = menu.tipo.nombre_tipo if menu.tipo else "N/A"
                nivel_educativo = menu.nivel_educativo.nombre_nivel if menu.nivel_educativo else "N/A"
                
                menus_serializados.append({
                    "id_menu_escolar": menu.id_menu_escolar,
                    "numero_menu": menu.numero_menu,
                    "id_tipo": menu.id_tipo,
                    "tipo_menu": tipo_menu,
                    "id_nivel_educativo": menu.id_nivel_educativo,
                    "nivel_educativo": nivel_educativo,
                    "productos": productos
                })

            return jsonify({"menus": menus_serializados}), 200

        except Exception as e:
            print("Error al obtener menús con productos:", str(e))
            return jsonify({"msg": "Error al obtener menús con productos", "error": str(e)}), 500

    @staticmethod
    def crear_menu_escolar():
        try:
            data = request.get_json()

            menu_existente = MenuEscolar.query.filter_by(
                numero_menu=data['numero_menu'],
                id_tipo=data['id_tipo'],
                id_nivel_educativo=data['id_nivel_educativo'],
                id_estado=1
            ).first()
            if menu_existente:
                return jsonify({"msg": "Ya existe un menú con el mismo número, tipo y nivel educativo"}), 409

            nuevo_menu = MenuEscolar(
                numero_menu=data['numero_menu'],
                id_tipo=data['id_tipo'],
                id_nivel_educativo=data['id_nivel_educativo'],
                id_estado=1 
            )
            db.session.add(nuevo_menu)
            db.session.commit()

            return jsonify({"msg": "Menú escolar creado exitosamente", "id_menu_escolar": nuevo_menu.id_menu_escolar}), 201

        except Exception as e:
            db.session.rollback()  
            print("Error al crear menú escolar:", str(e))
            return jsonify({"msg": "Error al crear menú escolar", "error": str(e)}), 500

    @staticmethod
    def actualizar_menu_escolar(id_menu_escolar):
        try:
            data = request.get_json()

            menu = MenuEscolar.query.filter_by(id_menu_escolar=id_menu_escolar, id_estado=1).first()
            if not menu:
                return jsonify({"msg": "Menú escolar no encontrado"}), 404

            existe_otro = MenuEscolar.query.filter(
                MenuEscolar.numero_menu == data.get('numero_menu', menu.numero_menu),
                MenuEscolar.id_tipo == data.get('id_tipo', menu.id_tipo),
                MenuEscolar.id_nivel_educativo == data.get('id_nivel_educativo', menu.id_nivel_educativo),
                MenuEscolar.id_estado == 1,
                MenuEscolar.id_menu_escolar != id_menu_escolar
            ).first()
            if existe_otro:
                return jsonify({"msg": "Ya existe un menú con el mismo número, tipo y nivel educativo"}), 409

            menu.numero_menu = data.get('numero_menu', menu.numero_menu)
            menu.id_tipo = data.get('id_tipo', menu.id_tipo)
            menu.id_nivel_educativo = data.get('id_nivel_educativo', menu.id_nivel_educativo)

            db.session.commit()
            return jsonify({"msg": "Menú escolar actualizado exitosamente"}), 200

        except Exception as e:
            db.session.rollback()  
            print("Error al actualizar menú escolar:", str(e))
            return jsonify({"msg": "Error al actualizar menú escolar", "error": str(e)}), 500
        
    @staticmethod
    def agregar_producto_a_menu(id_menu_escolar):
        try:
            data = request.get_json()

            menu = MenuEscolar.query.filter_by(id_menu_escolar=id_menu_escolar, id_estado=1).first()
            if not menu:
                return jsonify({"msg": "Menú escolar no encontrado"}), 404

            producto_existente = MenuProducto.query.filter_by(
                id_menu_escolar=id_menu_escolar,
                id_producto=data['id_producto'],
                id_estado=1 
            ).first()

            if producto_existente:
                if producto_existente.id_estado == 0:
                    producto_existente.id_estado = 1
                    producto_existente.precio_venta = data['precio_venta']  
                    db.session.commit()
                    return jsonify({"msg": "Producto reactivado en el menú exitosamente"}), 200
                else:
                    return jsonify({"msg": "El producto ya está asociado a este menú"}), 409

            nuevo_menu_producto = MenuProducto(
                id_menu_escolar=id_menu_escolar,
                id_producto=data['id_producto'],
                id_estado=1  
            )
            db.session.add(nuevo_menu_producto)
            db.session.commit()

            return jsonify({"msg": "Producto agregado al menú exitosamente"}), 201

        except Exception as e:
            db.session.rollback() 
            print("Error al agregar producto al menú:", str(e))
            return jsonify({"msg": "Error al agregar producto al menú", "error": str(e)}), 500
    



    @staticmethod
    def eliminar_menu_producto(id_menu_escolar):
        try:
            pedidos_activos = Pedido.query.filter_by(id_menu_escolar=id_menu_escolar, id_estado=1).count()
            if pedidos_activos > 0:
                return jsonify({"msg": "No se puede eliminar el menú porque hay pedidos activos que lo utilizan."}), 400

            menu = MenuEscolar.query.filter_by(id_menu_escolar=id_menu_escolar, id_estado=1).first()
            if not menu:
                return jsonify({"msg": "Menú no encontrado"}), 404

            menu.id_estado = 0

            productos = MenuProducto.query.filter_by(id_menu_escolar=id_menu_escolar, id_estado=1).all()
            for producto in productos:
                producto.id_estado = 0

            db.session.commit()
            return jsonify({"msg": "Menú eliminado exitosamente"}), 200

        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar menú:", str(e))
            return jsonify({"msg": "Error al eliminar menú", "error": str(e)}), 500
        
        

    @staticmethod
    def eliminar_producto_de_menu(id_menu_producto):
        try:

            menu_producto = MenuProducto.query.filter_by(id_menu_producto=id_menu_producto, id_estado=1).first()
            if not menu_producto:
                return jsonify({"msg": "Producto no encontrado en el menú"}), 404
            menu_producto.id_estado = 0
            db.session.commit()
            return jsonify({"msg": "Producto eliminado del menú exitosamente"}), 200
        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar producto de menú:", str(e))
            return jsonify({"msg": "Error al eliminar producto de menú", "error": str(e)}), 500
        
    
    
    # Gestión de Pedidos
    @staticmethod
    def obtener_escuelas():
        try:
            escuelas = Escuela.query.filter_by(id_estado=1).all()
            
            if not escuelas:
                return jsonify({"msg": "No se encontraron escuelas disponibles"}), 404
            
            escuelas_serializadas = [
                {
                    "id_escuela": escuela.id_escuela,
                    "nombre_escuela": escuela.nombre_escuela
                }
                for escuela in escuelas
            ]
            
            return jsonify(escuelas_serializadas), 200
        
        except Exception as e:
            print("Error al obtener escuelas:", str(e))
            return jsonify({"msg": "Error al obtener escuelas", "error": str(e)}), 500
        
    @staticmethod
    def crear_escuela():
        try:
            data = request.get_json()  
            
            escuela_existente = Escuela.query.filter_by(nombre_escuela=data['nombre_escuela'], id_estado=1).first()
            if escuela_existente:
                return jsonify({"msg": "La escuela ya existe"}), 409
            
            nueva_escuela = Escuela(
                nombre_escuela=data['nombre_escuela'],
                id_estado=1  
            )
            
            db.session.add(nueva_escuela)  
            db.session.commit() 
            return jsonify({"msg": "Escuela creada exitosamente"}), 201
        except Exception as e:
            db.session.rollback()  
            print("Error al crear escuela:", str(e))
            return jsonify({"msg": "Error al crear escuela", "error": str(e)}), 500
        
    @staticmethod   
    def actualizar_escuela(id_escuela):
        try:
            data = request.get_json()
            
            escuela = Escuela.query.filter_by(id_escuela=id_escuela, id_estado=1).first()
            if not escuela:
                return jsonify({"msg": "Escuela no encontrada"}), 404
            
            escuela.nombre_escuela = data.get('nombre_escuela', escuela.nombre_escuela)
            
            db.session.commit()
            return jsonify({"msg": "Escuela actualizada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al actualizar escuela:", str(e))
            return jsonify({"msg": "Error al actualizar escuela", "error": str(e)}), 500
        
        
    @staticmethod
    def eliminar_escuela(id_escuela):
        try:
            pedidos_asociados = Pedido.query.filter_by(id_escuela=id_escuela, id_estado=1).all()
            if pedidos_asociados:
                return jsonify({"msg": "No se puede eliminar la escuela porque tiene pedidos asociados"}), 400
            
            escuela = Escuela.query.filter_by(id_escuela=id_escuela, id_estado=1).first()
            if not escuela:
                return jsonify({"msg": "Escuela no encontrada"}), 404

            escuela.id_estado = 0
            db.session.commit()

            return jsonify({"msg": "Escuela eliminada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            print("Error al eliminar escuela:", str(e))
            return jsonify({"msg": "Error al eliminar escuela", "error": str(e)}), 500
            
            
    
    @staticmethod
    def obtener_pedidos_recientes():
        try:
            page = request.args.get("page", default=1, type=int)
            per_page = request.args.get("per_page", default=25, type=int)
            descripcion_semana = request.args.get("descripcion_semana", type=str)

            query = Pedido.query.join(SemanaPedido).filter(
                Pedido.id_estado == 1,
                SemanaPedido.estado == "abierto"
            )
            if descripcion_semana:
                query = query.filter(SemanaPedido.descripcion.ilike(f"%{descripcion_semana}%"))
            query = query.order_by(Pedido.fecha_creacion.desc())

            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            pedidos = pagination.items

            pedidos_serializados = []
            for pedido in pedidos:
                productos = [
                    {
                        "id_pedido_producto": pp.id_pedido_producto,
                        "id_producto": pp.id_producto,
                        "nombre_producto": pp.producto.nombre_producto if pp.producto else "",
                        "cantidad": pp.cantidad,
                        "precio_unitario": float(pp.precio_unitario),
                        "es_extra": pp.es_extra
                    }
                    for pp in pedido.pedido_productos if pp.id_estado == 1
                ]

                dias_es = {
                    "Monday": "Lunes",
                    "Tuesday": "Martes",
                    "Wednesday": "Miércoles",
                    "Thursday": "Jueves",
                    "Friday": "Viernes",
                    "Saturday": "Sábado",
                    "Sunday": "Domingo"
                }
                dia_semana_en = pedido.fecha_pedido.strftime("%A")
                dia_semana = dias_es.get(dia_semana_en, dia_semana_en)

                pedidos_serializados.append({
                    "id_pedido": pedido.id_pedido,
                    "id_semana_pedido": pedido.id_semana_pedido,
                    "id_escuela": pedido.id_escuela,
                    "escuela": pedido.escuela.nombre_escuela if pedido.escuela else "",
                    "usuario": pedido.usuario.usuario if pedido.usuario else "",
                    "id_menu_escolar": pedido.id_menu_escolar,
                    "menu_escolar": {
                        "numero_menu": pedido.menu_escolar.numero_menu if pedido.menu_escolar else "",
                        "tipo_menu": pedido.menu_escolar.tipo.nombre_tipo if pedido.menu_escolar and pedido.menu_escolar.tipo else "",
                        "nivel_educativo": pedido.menu_escolar.nivel_educativo.nombre_nivel if pedido.menu_escolar and pedido.menu_escolar.nivel_educativo else ""
                    } if pedido.menu_escolar else None,
                    "fecha_pedido": pedido.fecha_pedido.strftime("%Y-%m-%d"),
                    "dia_semana": dia_semana, 
                    "semana_pedido": pedido.semana_pedido.descripcion if pedido.id_semana_pedido else "",
                    "productos": productos
                })
            return jsonify({
                "pedidos": pedidos_serializados,
                "total": pagination.total,
                "pages": pagination.pages,
                "page": page
            }), 200
        except Exception as e:
            print("Error al obtener pedidos recientes:", str(e))
            return jsonify({"msg": "Error al obtener pedidos recientes", "error": str(e)}), 500

    @staticmethod
    def obtener_historial_pedidos():
        try:
            page = request.args.get("page", default=1, type=int)
            per_page = request.args.get("per_page", default=25, type=int)
            id_semana_pedido = request.args.get("id_semana_pedido", type=int)

            query = Pedido.query.join(SemanaPedido).filter(
                Pedido.id_estado == 1,
                SemanaPedido.estado == "cerrado"
            )
            if id_semana_pedido is not None:
                query = query.filter(Pedido.id_semana_pedido == id_semana_pedido)

            query = query.order_by(Pedido.fecha_creacion.desc())
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            pedidos = pagination.items

            pedidos_serializados = []
            for pedido in pedidos:
                productos = [
                    {
                        "id_pedido_producto": pp.id_pedido_producto,
                        "id_producto": pp.id_producto,
                        "nombre_producto": pp.producto.nombre_producto if pp.producto else "",
                        "cantidad": pp.cantidad,
                        "precio_unitario": float(pp.precio_unitario),
                        "es_extra": pp.es_extra
                    }
                    for pp in pedido.pedido_productos if pp.id_estado == 1
                ]

                dias_es = {
                    "Monday": "Lunes",
                    "Tuesday": "Martes",
                    "Wednesday": "Miércoles",
                    "Thursday": "Jueves",
                    "Friday": "Viernes",
                    "Saturday": "Sábado",
                    "Sunday": "Domingo"
                }
                dia_semana_en = pedido.fecha_pedido.strftime("%A")
                dia_semana = dias_es.get(dia_semana_en, dia_semana_en)

                pedidos_serializados.append({
                    "id_pedido": pedido.id_pedido,
                    "id_semana_pedido": pedido.id_semana_pedido,
                    "id_escuela": pedido.id_escuela,
                    "escuela": pedido.escuela.nombre_escuela if pedido.escuela else "",
                    "usuario": pedido.usuario.usuario if pedido.usuario else "",
                    "id_menu_escolar": pedido.id_menu_escolar,
                    "menu_escolar": {
                        "numero_menu": pedido.menu_escolar.numero_menu if pedido.menu_escolar else "",
                        "tipo_menu": pedido.menu_escolar.tipo.nombre_tipo if pedido.menu_escolar and pedido.menu_escolar.tipo else "",
                        "nivel_educativo": pedido.menu_escolar.nivel_educativo.nombre_nivel if pedido.menu_escolar and pedido.menu_escolar.nivel_educativo else ""
                    } if pedido.menu_escolar else None,
                    "fecha_pedido": pedido.fecha_pedido.strftime("%Y-%m-%d"),
                    "dia_semana": dia_semana, 
                    "semana_pedido": pedido.semana_pedido.descripcion if pedido.id_semana_pedido else "",
                    "productos": productos
                })
            return jsonify({
                "pedidos": pedidos_serializados,
                "total": pagination.total,
                "pages": pagination.pages,
                "page": page
            }), 200
        except Exception as e:
            print("Error al obtener historial de pedidos:", str(e))
            return jsonify({"msg": "Error al obtener historial de pedidos", "error": str(e)}), 500


    @staticmethod
    def crear_pedido():
        try:
            data = request.get_json()
            id_escuela = data.get("id_escuela")
            id_usuario = data.get("id_usuario")
            id_menu_escolar = data.get("id_menu_escolar")
            productos = data.get("productos", [])
            fecha_pedido_str = data.get("fecha_pedido")
            id_semana_pedido = data.get("id_semana_pedido")

            if not (id_escuela and id_usuario and id_menu_escolar and fecha_pedido_str):
                return jsonify({"msg": "Faltan datos obligatorios"}), 400

            productos_menu = MenuProducto.query.filter_by(
                id_menu_escolar=id_menu_escolar,
                id_estado=1
            ).all()
            if not productos_menu:
                return jsonify({"msg": "El menú seleccionado no tiene productos asignados. Por favor, asigne productos antes de crear el pedido."}), 400

            try:
                fecha_pedido = datetime.strptime(fecha_pedido_str, "%Y-%m-%d").date()
            except Exception:
                return jsonify({"msg": "Formato de fecha inválido, debe ser YYYY-MM-DD"}), 400
            
            semana = SemanaPedido.query.filter_by(id_semana_pedido=id_semana_pedido, id_estado=1).first()
            if not semana:
                return jsonify({"msg": "Semana de pedido no encontrada"}), 404
            if not (semana.fecha_inicio <= fecha_pedido <= semana.fecha_fin):
                return jsonify({"msg": "La fecha del pedido debe estar dentro del rango de la semana seleccionada"}), 400

            pedido_existente = Pedido.query.filter_by(
                id_escuela=id_escuela,
                fecha_pedido=fecha_pedido,
                id_semana_pedido=id_semana_pedido,
                id_estado=1
            ).first()
            if pedido_existente:
                return jsonify({"msg": "Ya existe un pedido para esa escuela, fecha y semana"}), 409

            nuevo_pedido = Pedido(
                id_escuela=id_escuela,
                id_usuario=id_usuario,
                id_menu_escolar=id_menu_escolar,
                fecha_pedido=fecha_pedido,
                id_semana_pedido=id_semana_pedido,
                id_tipo_estado=13,
                id_estado=1
            )
            db.session.add(nuevo_pedido)
            db.session.flush()

            if not productos:
                for mp in productos_menu:
                    pedido_producto = PedidoProducto(
                        id_pedido=nuevo_pedido.id_pedido,
                        id_producto=mp.id_producto,
                        cantidad=0,  
                        precio_unitario=mp.producto.precio_venta,
                        es_extra=False,
                        id_tipo_estado=14,
                        id_estado=1
                    )
                    db.session.add(pedido_producto)
            else:
                for prod in productos:
                    pedido_producto = PedidoProducto(
                        id_pedido=nuevo_pedido.id_pedido,
                        id_producto=prod["id_producto"],
                        cantidad=prod.get("cantidad", 0),
                        precio_unitario=prod["precio_unitario"],
                        es_extra=prod.get("es_extra", False),
                        id_tipo_estado=14,
                        id_estado=1
                    )
                    db.session.add(pedido_producto)
                
            db.session.commit()
            return jsonify({"msg": "Pedido creado exitosamente", "id_pedido": nuevo_pedido.id_pedido}), 201

        except Exception as e:
            db.session.rollback()
            print("Error al crear pedido:", str(e))
            return jsonify({"msg": "Error al crear pedido", "error": str(e)}), 500
        
    
    
    @staticmethod
    def actualizar_pedido(id_pedido):
        try:
            data = request.get_json()
            id_escuela = data.get("id_escuela")
            id_usuario = data.get("id_usuario")
            id_menu_escolar = data.get("id_menu_escolar")
            fecha_pedido_str = data.get("fecha_pedido")  
     

            if not (id_escuela and id_usuario and id_menu_escolar  and fecha_pedido_str):
                return jsonify({"msg": "Faltan datos obligatorios"}), 400

            try:
                fecha_pedido = datetime.strptime(fecha_pedido_str, "%Y-%m-%d").date()
            except Exception:
                return jsonify({"msg": "Formato de fecha inválido, debe ser YYYY-MM-DD"}), 400

            pedido = Pedido.query.filter_by(id_pedido=id_pedido, id_estado=1).first()
            if not pedido:
                return jsonify({"msg": "Pedido no encontrado"}), 404

            pedido.id_escuela = id_escuela
            pedido.id_usuario = id_usuario
            pedido.id_menu_escolar = id_menu_escolar
            pedido.fecha_pedido = fecha_pedido 
            pedido.id_semana_pedido = data.get("id_semana_pedido", pedido.id_semana_pedido)

            db.session.commit()
            return jsonify({"msg": "Pedido actualizado exitosamente"}), 200

        except Exception as e:
            db.session.rollback()
            print("Error al actualizar pedido:", str(e))
            return jsonify({"msg": "Error al actualizar pedido", "error": str(e)}), 500
        
        
        

    @staticmethod
    def eliminar_pedido_productos(id_pedido):
        try:
            pedido = Pedido.query.filter_by(id_pedido=id_pedido, id_estado=1).first()
            if not pedido:
                return jsonify({"msg": "Pedido no encontrado"}), 404

            pedido.id_estado = 0

            productos = PedidoProducto.query.filter_by(id_pedido=id_pedido, id_estado=1).all()
            for producto in productos:
                producto.id_estado = 0

            db.session.commit()
            return jsonify({"msg": "Pedido eliminado exitosamente"}), 200

        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar pedido:", str(e))
            return jsonify({"msg": "Error al eliminar pedido", "error": str(e)}), 500
        
        
    # FUNCIONES PARA LA TABLA DE PEDIDO_PRODUCTO
    @staticmethod
    def obtener_productos_pedido(id_pedido):
        try:
            nombre_producto = request.args.get("nombre_producto", type=str)

            query = PedidoProducto.query.filter_by(id_pedido=id_pedido, id_estado=1)

            if nombre_producto:
                query = query.join(Producto).filter(Producto.nombre_producto.ilike(f"%{nombre_producto}%"))

            productos = query.all()

            productos_serializados = [
                {
                    "id_pedido_producto": p.id_pedido_producto,
                    "id_producto": p.id_producto,
                    "nombre_producto": p.producto.nombre_producto if p.producto else "",
                    "nombre_categoria": p.producto.categoria.nombre_categoria if p.producto and p.producto.categoria else "",
                    "cantidad": p.cantidad,
                    "precio_unitario": float(p.precio_unitario),
                    "subtotal": float(p.cantidad) * float(p.precio_unitario),
                    "es_extra": p.es_extra
                }
                for p in productos
            ]
            total_venta = sum(p["subtotal"] for p in productos_serializados)

            subtotales_categoria = {}
            for p in productos_serializados:
                categoria = p["nombre_categoria"] or "Sin categoría"
                subtotales_categoria[categoria] = subtotales_categoria.get(categoria, 0) + p["subtotal"]

            return jsonify({
                "productos": productos_serializados,
                "total_venta": total_venta,
                "subtotales_categoria": subtotales_categoria
            }), 200
        except Exception as e:
            print("Error al obtener productos del pedido:", str(e))
            return jsonify({"msg": "Error al obtener productos del pedido", "error": str(e)}), 500
        
    @staticmethod
    def agregar_producto_pedido(id_pedido):
        try:
            data = request.get_json()
            id_producto = data.get("id_producto")
            cantidad = data.get("cantidad")
            precio_unitario = data.get("precio_unitario")

            if not (id_producto and cantidad and precio_unitario is not None):
                return jsonify({"msg": "Faltan datos obligatorios"}), 400

            pedido = Pedido.query.filter_by(id_pedido=id_pedido, id_estado=1).first()
            if not pedido:
                return jsonify({"msg": "Pedido no encontrado"}), 404

            producto = Producto.query.filter_by(id_producto=id_producto, id_estado=1).first()
            if not producto:
                return jsonify({"msg": "Producto no encontrado"}), 404

            producto_existente = PedidoProducto.query.filter_by(
                id_pedido=id_pedido,
                id_producto=id_producto,
                id_estado=1
            ).first()
            if producto_existente:
                return jsonify({"msg": "El producto ya está agregado al pedido"}), 409

            pedido_producto = PedidoProducto(
                id_pedido=id_pedido,
                id_producto=id_producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                es_extra=True,
                id_tipo_estado=14,
                id_estado=1
            )
            db.session.add(pedido_producto)
            db.session.commit()
            return jsonify({"msg": "Producto extra agregado exitosamente"}), 201

        except Exception as e:
            db.session.rollback()
            print("Error al agregar producto extra:", str(e))
            return jsonify({"msg": "Error al agregar producto extra", "error": str(e)}), 500
        
    @staticmethod
    def actualizar_producto_pedido(id_pedido_producto):
        try:
            data = request.get_json()
            cantidad = data.get("cantidad")
            precio_unitario = data.get("precio_unitario")

            if cantidad is None or precio_unitario is None:
                return jsonify({"msg": "Faltan datos obligatorios"}), 400

            pedido_producto = PedidoProducto.query.filter_by(id_pedido_producto=id_pedido_producto, id_estado=1).first()
            if not pedido_producto:
                return jsonify({"msg": "Producto no encontrado en el pedido"}), 404

            pedido_producto.cantidad = cantidad
            pedido_producto.precio_unitario = precio_unitario

            db.session.commit()
            return jsonify({"msg": "Producto actualizado exitosamente"}), 200

        except Exception as e:
            db.session.rollback()
            print("Error al actualizar producto en pedido:", str(e))
            return jsonify({"msg": "Error al actualizar producto en pedido", "error": str(e)}), 500
        
    @staticmethod
    def eliminar_producto_pedido(id_pedido_producto):
        try:
            pedido_producto = PedidoProducto.query.filter_by(id_pedido_producto=id_pedido_producto, id_estado=1).first()
            if not pedido_producto:
                return jsonify({"msg": "Producto no encontrado en el pedido"}), 404

            pedido_producto.id_estado = 0
            db.session.commit()

            return jsonify({"msg": "Producto eliminado del pedido exitosamente"}), 200

        except Exception as e:
            db.session.rollback()  
            print("Error al eliminar producto de pedido:", str(e))
            return jsonify({"msg": "Error al eliminar producto de pedido", "error": str(e)}), 500
        
        
        
        
        
        
        
        
        

    @staticmethod
    def obtener_semanas_pedidos():
        try:
            page = request.args.get("page", default=1, type=int)
            per_page = request.args.get("per_page", default=15, type=int)
            id_escuela = request.args.get('id_escuela', type=int)
            descripcion = request.args.get('descripcion', type=str)

            query = SemanaPedido.query.filter_by(id_estado=1).order_by(SemanaPedido.fecha_creacion.desc())
            if id_escuela:
                query = query.filter_by(id_escuela=id_escuela)
            query = query.filter_by(estado="abierto")
            if descripcion:
                query = query.filter(SemanaPedido.descripcion.ilike(f"%{descripcion}%"))

            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            semanas = pagination.items

            semanas_serializadas = [
                {
                    "id_semana_pedido": semana.id_semana_pedido,
                    "id_escuela": semana.id_escuela,
                    "nombre_escuela": semana.escuela.nombre_escuela if semana.escuela else "",
                    "fecha_inicio": semana.fecha_inicio.strftime("%Y-%m-%d"),
                    "fecha_fin": semana.fecha_fin.strftime("%Y-%m-%d"),
                    "descripcion": semana.descripcion,
                    "estado": semana.estado
                }
                for semana in semanas
            ]
            return jsonify({
                "semanas": semanas_serializadas,
                "total": pagination.total,
                "pages": pagination.pages,
                "page": page
            }), 200

        except Exception as e:
            print("Error al obtener semanas de pedidos:", str(e))
            return jsonify({"msg": "Error al obtener semanas de pedidos", "error": str(e)}), 500


    @staticmethod
    def total_semana_pedido():
        try:
            id_semana_pedido = request.args.get('id_semana_pedido', type=int)
            id_escuela = request.args.get('id_escuela', type=int)
            if not id_semana_pedido or not id_escuela:
                return jsonify({"msg": "Faltan parámetros"}), 400

            total = (
                db.session.query(
                    func.sum(PedidoProducto.cantidad * PedidoProducto.precio_unitario)
                )
                .join(Pedido, Pedido.id_pedido == PedidoProducto.id_pedido)
                .filter(
                    Pedido.id_escuela == id_escuela,
                    Pedido.id_semana_pedido == id_semana_pedido,
                    Pedido.id_estado == 1,
                    PedidoProducto.id_estado == 1
                )
                .scalar()
            )

            return jsonify({"total_semana": float(total or 0)}), 200

        except Exception as e:
            print("Error al calcular total de la semana:", str(e))
            return jsonify({"msg": "Error al calcular total de la semana", "error": str(e)}), 500
        

    @staticmethod
    def obtener_historial_semanas_pedidos():
        try:
            page = request.args.get("page", default=1, type=int)
            per_page = request.args.get("per_page", default=20, type=int)
            id_escuela = request.args.get('id_escuela', type=int)
            descripcion = request.args.get('descripcion', type=str)

            query = SemanaPedido.query.filter_by(id_estado=1, estado="cerrado").order_by(SemanaPedido.fecha_creacion.desc())
            if id_escuela:
                query = query.filter_by(id_escuela=id_escuela)
            if descripcion:
                query = query.filter(SemanaPedido.descripcion.ilike(f"%{descripcion}%"))

            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            semanas = pagination.items

            semanas_serializadas = [
                {
                    "id_semana_pedido": semana.id_semana_pedido,
                    "id_escuela": semana.id_escuela,
                    "nombre_escuela": semana.escuela.nombre_escuela if semana.escuela else "",
                    "fecha_inicio": semana.fecha_inicio.strftime("%Y-%m-%d"),
                    "fecha_fin": semana.fecha_fin.strftime("%Y-%m-%d"),
                    "descripcion": semana.descripcion,
                    "estado": semana.estado
                }
                for semana in semanas
            ]
            return jsonify({
                "semanas": semanas_serializadas,
                "total": pagination.total,
                "pages": pagination.pages,
                "page": page
            }), 200

        except Exception as e:
            print("Error al obtener historial de semanas de pedidos:", str(e))
            return jsonify({"msg": "Error al obtener historial de semanas de pedidos", "error": str(e)}), 500
    
  
    @staticmethod
    def cerrar_semana_pedido(id_semana_pedido):
        try:
            #
            semana = SemanaPedido.query.get(id_semana_pedido)
            if not semana or semana.id_estado != 1:
                return jsonify({"msg": "Semana no encontrada"}), 404
            if semana.estado == "cerrado":
                return jsonify({"msg": "La semana ya está cerrada"}), 400

            semana.estado = "cerrado"

            db.session.commit()
            return jsonify({"msg": "Semana cerrada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error al cerrar semana", "error": str(e)}), 500
    
    @staticmethod
    def reabrir_semana_y_pedidos(id_semana_pedido):
        try:
            semana = SemanaPedido.query.get(id_semana_pedido)
            if not semana or semana.id_estado != 1:
                return jsonify({"msg": "Semana no encontrada"}), 404
            if semana.estado == "abierto":
                return jsonify({"msg": "La semana ya está abierta"}), 400

            semana.estado = "abierto"

            pedidos = Pedido.query.filter_by(id_semana_pedido=id_semana_pedido, id_estado=1).all()
            for pedido in pedidos:
                for pp in pedido.pedido_productos:
                    pp.id_estado = 1 

            db.session.commit()
            return jsonify({"msg": "Semana y pedidos reabiertos exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error al reabrir semana y pedidos", "error": str(e)}), 500
        
    
    
    @staticmethod
    def crear_semana_pedido():
        try:
            data = request.get_json()
            
            nueva_semana = SemanaPedido(
                id_escuela=data['id_escuela'],
                fecha_inicio=datetime.strptime(data['fecha_inicio'], "%Y-%m-%d").date(),
                fecha_fin=datetime.strptime(data['fecha_fin'], "%Y-%m-%d").date(),
                descripcion=data.get('descripcion'),
                estado=data.get('estado', 'abierto'),
                id_tipo_estado=15,
                id_estado=1
            )
            db.session.add(nueva_semana)
            db.session.commit()
            return jsonify({"msg": "Semana creada exitosamente", "id_semana_pedido": nueva_semana.id_semana_pedido}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error al crear semana", "error": str(e)}), 500
        
    @staticmethod
    def actualizar_semana_pedido(id_semana_pedido):
        try:
            data = request.get_json()
            semana = SemanaPedido.query.get(id_semana_pedido)
            if not semana:
                return jsonify({"msg": "Semana no encontrada"}), 404
            semana.id_escuela = data.get('id_escuela', semana.id_escuela)
            semana.fecha_inicio = datetime.strptime(data['fecha_inicio'], "%Y-%m-%d").date()
            semana.fecha_fin = datetime.strptime(data['fecha_fin'], "%Y-%m-%d").date()
            semana.descripcion = data.get('descripcion', semana.descripcion)
            semana.estado = data.get('estado', semana.estado)
            db.session.commit()
            return jsonify({"msg": "Semana actualizada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error al actualizar semana", "error": str(e)}), 500
            
        
    @staticmethod
    def eliminar_semana_pedido(id_semana_pedido):
        try:
            semana = SemanaPedido.query.get(id_semana_pedido)
            if not semana:
                return jsonify({"msg": "Semana no encontrada"}), 404

            pedidos_asociados = Pedido.query.filter_by(id_semana_pedido=id_semana_pedido, id_estado=1).count()
            if pedidos_asociados > 0:
                return jsonify({"msg": "No se puede eliminar la semana porque tiene pedidos asociados."}), 400

            semana.id_estado = 0
            db.session.commit()
            return jsonify({"msg": "Semana eliminada exitosamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error al eliminar semana", "error": str(e)}), 500
            
            
    
        
    @staticmethod
    def informe_detallado_semana_pedido():
        try:
            id_semana_pedido = request.args.get('id_semana_pedido', type=int)
            id_escuela = request.args.get('id_escuela', type=int)
            if not id_semana_pedido or not id_escuela:
                return jsonify({"msg": "Faltan parámetros"}), 400

            escuela = db.session.query(Escuela).filter_by(id_escuela=id_escuela).first()
            nombre_escuela = escuela.nombre_escuela if escuela else ""

            detalles = (
                db.session.query(
                    Producto.nombre_producto,
                    Categoria.nombre_categoria,
                    PedidoProducto.precio_unitario,
                    func.sum(PedidoProducto.cantidad).label("cantidad_total"),
                    func.sum(PedidoProducto.cantidad * PedidoProducto.precio_unitario).label("subtotal")
                )
                .join(Pedido, Pedido.id_pedido == PedidoProducto.id_pedido)
                .join(Producto, Producto.id_producto == PedidoProducto.id_producto)
                .join(Categoria, Categoria.id_categoria == Producto.id_categoria)
                .filter(
                    Pedido.id_escuela == id_escuela,
                    Pedido.id_semana_pedido == id_semana_pedido,
                    Pedido.id_estado == 1,
                    PedidoProducto.id_estado == 1
                )
                .group_by(
                    Producto.nombre_producto,
                    Categoria.nombre_categoria,
                    PedidoProducto.precio_unitario
                )
                .order_by(Categoria.nombre_categoria, Producto.nombre_producto)
                .all()
            )

            subtotales_categoria = {}
            productos = []
            productos_por_categoria = {}

            for d in detalles:
                prod = {
                    "nombre_producto": d.nombre_producto,
                    "precio_unitario": float(d.precio_unitario),
                    "cantidad": float(d.cantidad_total),
                    "subtotal": float(d.subtotal)
                }
                productos.append({
                    "nombre_producto": d.nombre_producto,
                    "nombre_categoria": d.nombre_categoria,
                    "precio_unitario": float(d.precio_unitario),
                    "cantidad": float(d.cantidad_total),
                    "subtotal": float(d.subtotal)
                })
                cat = d.nombre_categoria
                if cat not in productos_por_categoria:
                    productos_por_categoria[cat] = []
                productos_por_categoria[cat].append(prod)
                subtotales_categoria[cat] = subtotales_categoria.get(cat, 0) + float(d.subtotal)

            total_general = sum(subtotales_categoria.values())

            return jsonify({
                "nombre_escuela": nombre_escuela,
                "productos": productos,
                "productos_por_categoria": productos_por_categoria,
                "subtotales_categoria": subtotales_categoria,
                "total_general": total_general
            }), 200

        except Exception as e:
            print("Error al generar informe detallado:", str(e))
            return jsonify({"msg": "Error al generar informe detallado", "error": str(e)}), 500
        
        
        


   
        