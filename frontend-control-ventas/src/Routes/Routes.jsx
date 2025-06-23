import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Inicio from "../pages/Inicio/Inicio";
import Usuarios from "../pages/Configuracion/Usuarios/Usuarios";
import Roles from "../pages//Configuracion/Roles/Roles";
import GestionDeProductos from "../pages/ControlDeVentas/GestionDeProductos";
import GestionDeMenus from "../pages/ControlDeVentas/GestionDeMenus";
import GestionDePedidos from "../pages/ControlDeVentas/GestionDePedidos";
import GestionDeCategorias from "../pages/ControlDeVentas/GestionDeCategorias";
import ProtectedRoute from "./ProtectedRoute";
import GestionDeTipoMenu from "../pages/ControlDeVentas/GestionDeTipoMenu";
import GestionNivelEducativo from "../pages/ControlDeVentas/GestionNivelEducativo";
import HistorialDePedidos from "../pages/ControlDeVentas/HistorialDePedidos";
import GestionDeEscuelas from "../pages/ControlDeVentas/GestionDeEscuelas";
import GestionDeProductosPedido from "../pages/ControlDeVentas/GestionDeProductosPedido";
import GestionDeSemanasPedidos from "../pages/ControlDeVentas/GestionDeSemanaPedidos";
import InformeSemanaPedidos from "../pages/ControlDeVentas/InformeSemanaPedidos";
import HistorialDeSemanaPedidos from "../pages/ControlDeVentas/HistorialDeSemanaPedidos";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/inicio"
        element={
          <ProtectedRoute>
            <Inicio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <Roles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categorias"
        element={
          <ProtectedRoute>
            <GestionDeCategorias />
          </ProtectedRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <ProtectedRoute>
            <GestionDeProductos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menus"
        element={
          <ProtectedRoute>
            <GestionDeMenus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <GestionDePedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos/:id_pedido/productos"
        element={
          <ProtectedRoute>
            <GestionDeProductosPedido />
          </ProtectedRoute>
        }
      />
      <Route
        path="/semanapedidos"
        element={
          <ProtectedRoute>
            <GestionDeSemanasPedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/informesemanapedidos/:id_semana_pedido/:id_escuela"
        element={
          <ProtectedRoute>
            <InformeSemanaPedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tiposmenus"
        element={
          <ProtectedRoute>
            <GestionDeTipoMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/niveleseducativos"
        element={
          <ProtectedRoute>
            <GestionNivelEducativo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historialpedidos"
        element={
          <ProtectedRoute>
            <HistorialDePedidos />
          </ProtectedRoute>
        }
      />
            <Route
        path="/historialsemanaspedidos"
        element={
          <ProtectedRoute>
            <HistorialDeSemanaPedidos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/escuelas"
        element={
          <ProtectedRoute>
            <GestionDeEscuelas />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
};

export default AppRoutes;
