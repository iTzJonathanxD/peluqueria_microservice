import React, { useState, useEffect } from 'react';
import socket from '../services/socketService';
import './css/CategoriasPage.css';

const FacturasPage = () => {
    const [facturas, setFacturas] = useState([]);
    const [citas, setCitas] = useState([]);
    const [nuevaFactura, setNuevaFactura] = useState({
        citaId: '',
        montoTotal: '',
        metodoPago: 'efectivo',
        fechaPago: '',
    });
    const [edicion, setEdicion] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = () => {
        if (!isConnected) {
            socket.emit('buscarTodasFacturas', null, (response) => {
                if (response.estado === 'éxito') {
                    setFacturas(response.datos);
                }
            });

            socket.emit('buscarTodasCitas', null, (response) => {
                if (response.estado === 'éxito') {
                    setCitas(response.datos);
                }
            });

            socket.on('facturaActualizada', (factura) => {
                setFacturas((prev) => prev.map((f) => (f.id === factura.id ? factura : f)));
            });

            socket.on('facturaCreada', (factura) => {
                setFacturas((prev) => [...prev, factura]);
            });

            socket.on('facturaEliminada', ({ id }) => {
                setFacturas((prev) => prev.filter((f) => f.id !== id));
            });

            setIsConnected(true);
        }
    };

    useEffect(() => {
        return () => {
            socket.off('facturaActualizada');
            socket.off('facturaCreada');
            socket.off('facturaEliminada');
            setIsConnected(false);
        };
    }, []);

    const handleCrearFactura = () => {
        // Validar que todos los campos requeridos estén completos
        const { citaId, montoTotal, metodoPago, fechaPago } = nuevaFactura;
        if (!citaId || !montoTotal || !fechaPago) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        // Transformar datos si es necesario
        const payload = {
            citaId: parseInt(citaId, 10),
            montoTotal: parseFloat(montoTotal),
            metodoPago,
            fechaPago,
        };

        socket.emit('crearFactura', payload, (response) => {
            if (response.estado === 'éxito') {
                setNuevaFactura({
                    citaId: '',
                    montoTotal: '',
                    metodoPago: 'efectivo',
                    fechaPago: '',
                });
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleActualizarFactura = () => {
        const { citaId, montoTotal, metodoPago, fechaPago } = edicion;
        if (!citaId || !montoTotal || !fechaPago) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        const payload = {
            ...edicion,
            citaId: parseInt(citaId, 10),
            montoTotal: parseFloat(montoTotal),
        };

        socket.emit('actualizarFactura', payload, (response) => {
            if (response.estado === 'éxito') {
                setEdicion(null);
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleEliminarFactura = (id) => {
        socket.emit('eliminarFactura', id, (response) => {
            if (response.estado !== 'éxito') {
                alert(response.mensaje);
            }
        });
    };

    return (
        <div className="facturas-page">
            <h2 className="titulo">Gestión de Facturas</h2>
            <button className="btn conectar" onClick={connectSocket} disabled={isConnected}>
                {isConnected ? 'Conectado' : 'Conectar Cliente'}
            </button>

            {isConnected && (
                <>
                    <div className="formulario">
                        <h3>Crear Factura</h3>
                        <select
                            value={nuevaFactura.citaId}
                            onChange={(e) => setNuevaFactura({ ...nuevaFactura, citaId: e.target.value })}
                        >
                            <option value="">Seleccione una cita</option>
                            {citas.map((cita) => (
                                <option key={cita.id} value={cita.id}>
                                    {`Cita ${cita.id} - Cliente: ${cita.cliente?.nombre || 'N/A'}`}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Monto Total"
                            value={nuevaFactura.montoTotal}
                            onChange={(e) => setNuevaFactura({ ...nuevaFactura, montoTotal: e.target.value })}
                        />
                        <select
                            value={nuevaFactura.metodoPago}
                            onChange={(e) => setNuevaFactura({ ...nuevaFactura, metodoPago: e.target.value })}
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                        <input
                            type="datetime-local"
                            placeholder="Fecha de Pago"
                            value={nuevaFactura.fechaPago}
                            onChange={(e) => setNuevaFactura({ ...nuevaFactura, fechaPago: e.target.value })}
                        />
                        <button className="btn crear" onClick={handleCrearFactura}>Crear</button>
                    </div>

                    <table className="tabla-facturas">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cita</th>
                                <th>Monto Total</th>
                                <th>Método de Pago</th>
                                <th>Fecha de Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map((factura) => (
                                <tr key={factura.id}>
                                    <td>{factura.id}</td>
                                    <td>{`Cita ${factura.cita?.id || 'N/A'}`}</td>
                                    <td>{factura.montoTotal}</td>
                                    <td>{factura.metodoPago}</td>
                                    <td>{new Date(factura.fechaPago).toLocaleString()}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => setEdicion(factura)}>Editar</button>
                                        <button className="btn eliminar" onClick={() => handleEliminarFactura(factura.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default FacturasPage;
