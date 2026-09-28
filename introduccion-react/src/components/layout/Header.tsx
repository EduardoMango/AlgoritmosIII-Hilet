import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <span className="badge-catedra">Gestión de Desarrollo de Software / Algoritmos III</span>
          <h1 className="header-title">Bloque 1: Filosofía de React y Componentes Básicos</h1>
          <p className="header-subtitle">
            Entorno interactivo para explorar los fundamentos arquitectónicos, la reactividad declarativa,
            la sintaxis JSX/TSX y el flujo unidireccional de componentes.
          </p>
        </div>
        <div className="header-meta">
          <div className="meta-card">
            <span className="meta-label">Versión React</span>
            <span className="meta-val">19.x (TSX)</span>
          </div>
          <div className="meta-card">
            <span className="meta-label">Paradigma</span>
            <span className="meta-val">Declarativo</span>
          </div>
          <div className="meta-card">
            <span className="meta-label">Herramienta</span>
            <span className="meta-val">Vite + TypeScript</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

