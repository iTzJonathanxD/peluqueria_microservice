import React from 'react';
import './Dashboard.css';

const Dashboard = ({ title, content, databaseName }) => {
    const handleDownload = () => {
        const downloadUrl = `http://localhost:3100/api/reporte/${databaseName}`;
        window.open(downloadUrl, '_blank'); 
    };

    return (
        <div className="dashboard">
            <h1>{title}</h1>
            <div className="dashboard-content">{content}</div>
            <button className="btn descargar-pdf" onClick={handleDownload}>
                Descargar PDF
            </button>
        </div>
    );
};

export default Dashboard;
