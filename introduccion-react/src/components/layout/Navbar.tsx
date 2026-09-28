import React from 'react';

export type TabId = 'filosofia' | 'jsx' | 'componentes' | 'children' | 'comparativa' | 'todos';

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  badge: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'todos', label: 'Visión General', badge: 'Completo' },
  { id: 'filosofia', label: '1.1 Filosofía & VDOM', badge: 'UI = f(State)' },
  { id: 'jsx', label: '1.2 Sintaxis JSX / TSX', badge: 'Tipado' },
  { id: 'componentes', label: '1.3 Componentes & Props', badge: 'Inmutabilidad' },
  { id: 'children', label: '1.4 Composición (children)', badge: 'ReactNode' },
  { id: 'comparativa', label: '1.5 Resumen Comparativo', badge: 'Matriz' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="app-nav" aria-label="Navegación temática del apunte">
      <div className="nav-container">
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                type="button"
                className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <span className="nav-label">{item.label}</span>
                <span className="nav-badge">{item.badge}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

