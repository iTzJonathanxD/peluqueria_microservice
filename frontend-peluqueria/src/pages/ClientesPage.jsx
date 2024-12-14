import React, { useState, useEffect } from 'react';
import socket from '../services/socketService';
import './css/CategoriasPage.css';

const ClientesPage = () => {
    const [clientes, setClientes] = useState([]);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
    });
    const [edicion, setEdicion] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = () => {
        if (!isConnected) {
            socket.emit('buscarTodosClientes', null, (response) => {
                if (response.estado === 'éxito') {
                    setClientes(response.datos);
                }
            });

            // Escuchar actualizaciones en tiempo real
            socket.on('clienteActualizado', (cliente) => {
                setClientes((prev) => prev.map((c) => (c.id === cliente.id ? cliente : c)));
            });

            socket.on('clienteCreado', (cliente) => {
                setClientes((prev) => [...prev, cliente]);
            });

            socket.on('clienteEliminado', ({ id }) => {
                setClientes((prev) => prev.filter((c) => c.id !== id));
            });

            setIsConnected(true);
        }
    };

    useEffect(() => {
        return () => {
            socket.off('clienteActualizado');
            socket.off('clienteCreado');
            socket.off('clienteEliminado');
            setIsConnected(false);
        };
    }, []);

    const handleCrearCliente = () => {
        socket.emit('crearCliente', nuevoCliente, (response) => {
            if (response.estado === 'éxito') {
                setNuevoCliente({
                    nombre: '',
                    email: '',
                    telefono: '',
                    direccion: '',
                });
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleActualizarCliente = () => {
        socket.emit('actualizarCliente', edicion, (response) => {
            if (response.estado === 'éxito') {
                setEdicion(null);
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleEliminarCliente = (id) => {
        socket.emit('eliminarCliente', id, (response) => {
            if (response.estado !== 'éxito') {
                alert(response.mensaje);
            }
        });
    };

    return (
        <div className="clientes-page">
            <h2 className="titulo">Gestión de Clientes</h2>
            <button className="btn conectar" onClick={connectSocket} disabled={isConnected}>
                {isConnected ? 'Conectado' : 'Conectar Cliente'}
            </button>

            {isConnected && (
                <>
                    <div className="formulario">
                        <h3>Crear Cliente</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoCliente.nombre}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={nuevoCliente.email}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={nuevoCliente.telefono}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={nuevoCliente.direccion}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                        />
                        <button className="btn crear" onClick={handleCrearCliente}>Crear</button>
                    </div>

                    {edicion && (
                        <div className="formulario">
                            <h3>Editar Cliente</h3>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={edicion.nombre}
                                onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={edicion.email}
                                onChange={(e) => setEdicion({ ...edicion, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Teléfono"
                                value={edicion.telefono}
                                onChange={(e) => setEdicion({ ...edicion, telefono: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Dirección"
                                value={edicion.direccion}
                                onChange={(e) => setEdicion({ ...edicion, direccion: e.target.value })}
                            />
                            <button className="btn actualizar" onClick={handleActualizarCliente}>Actualizar</button>
                            <button className="btn cancelar" onClick={() => setEdicion(null)}>Cancelar</button>
                        </div>
                    )}

                    <table className="tabla-clientes">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.direccion}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => setEdicion(cliente)}>Editar</button>
                                        <button className="btn eliminar" onClick={() => handleEliminarCliente(cliente.id)}>Eliminar</button>
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

export default ClientesPage;
