import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="layout-aplicacion">
          <Navbar />
          <main className="contenido-principal">
            <AppRoutes />
          </main>
          <footer className="pie-pagina">
            <div className="pie-pagina-contenido">
              <span>Demostración de Arquitectura de Autenticación, Rutas Protegidas y Axios Interceptors</span>
              <span className="separador">|</span>
              <span>Bloque 6 - Algoritmos III</span>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

