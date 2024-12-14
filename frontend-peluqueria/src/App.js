import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import CategoriasPage from './pages/CategoriasPage';
import CitasPage from './pages/CitasPage';
import ClientesPage from './pages/ClientesPage';
import FacturasPage from './pages/FacturasPage';
import MascotasPage from './pages/MascotasPage';
import ServiciosPage from './pages/ServiciosPage';
import './App.css';

const App = () => {
    const [currentPage, setCurrentPage] = useState('categorias');

    const renderPage = () => {
        switch (currentPage) {
            case 'categorias': return <CategoriasPage />;
            case 'citas': return <CitasPage />;
            case 'clientes': return <ClientesPage />;
            case 'facturas': return <FacturasPage />;
            case 'mascotas': return <MascotasPage />;
            case 'servicios': return <ServiciosPage />;
            default: return <CategoriasPage />;
        }
    };

    return (
        <div className="app-container">
            <Sidebar onNavigate={setCurrentPage} />
            <Dashboard 
                title={currentPage.toUpperCase()} 
                content={renderPage()} 
                databaseName={currentPage} 
            />
        </div>
    );
};

export default App;
