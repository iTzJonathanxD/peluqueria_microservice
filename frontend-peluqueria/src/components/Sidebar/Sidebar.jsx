import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onNavigate }) => (
    <div className="sidebar">
        <h2>Menú</h2>
        <ul>
            <li onClick={() => onNavigate('categorias')}>Categorías</li>
            <li onClick={() => onNavigate('citas')}>Citas</li>
            <li onClick={() => onNavigate('clientes')}>Clientes</li>
            <li onClick={() => onNavigate('facturas')}>Facturas</li>
            <li onClick={() => onNavigate('mascotas')}>Mascotas</li>
            <li onClick={() => onNavigate('servicios')}>Servicios</li>
        </ul>
    </div>
);

export default Sidebar;
