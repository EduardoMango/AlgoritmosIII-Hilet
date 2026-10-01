import { Biblioteca } from './components/Biblioteca';
import './App.css';

/**
 * Componente Raíz de la Aplicación
 * ---------------------------------
 * Actúa como contenedor principal limpio, delegando la lógica
 * y la presentación al componente de dominio <Biblioteca />.
 */
export function App() {
  return <Biblioteca />;
}

export default App;
