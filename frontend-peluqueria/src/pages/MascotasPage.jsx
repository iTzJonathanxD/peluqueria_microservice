import React, { useState, useEffect } from 'react';
import socket from '../services/socketService';
import './css/CategoriasPage.css';

const MascotasPage = () => {
    const [mascotas, setMascotas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [nuevaMascota, setNuevaMascota] = useState({
        clienteId: '',
        nombre: '',
        raza: '',
        edad: '',
        peso: '',
    });
    const [edicion, setEdicion] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = () => {
        if (!isConnected) {
            socket.emit('buscarTodasMascotas', null, (response) => {
                if (response.estado === 'éxito') {
                    setMascotas(response.datos);
                }
            });

            // Cargar clientes disponibles
            socket.emit('buscarTodosClientes', null, (response) => {
                if (response.estado === 'éxito') {
                    setClientes(response.datos);
                }
            });

            // Escuchar actualizaciones en tiempo real
            socket.on('mascotaActualizada', (mascota) => {
                setMascotas((prev) => prev.map((m) => (m.id === mascota.id ? mascota : m)));
            });

            socket.on('mascotaCreada', (mascota) => {
                setMascotas((prev) => [...prev, mascota]);
            });

            socket.on('mascotaEliminada', ({ id }) => {
                setMascotas((prev) => prev.filter((m) => m.id !== id));
            });

            setIsConnected(true);
        }
    };

    useEffect(() => {
        return () => {
            socket.off('mascotaActualizada');
            socket.off('mascotaCreada');
            socket.off('mascotaEliminada');
            setIsConnected(false);
        };
    }, []);

    const handleCrearMascota = () => {
        socket.emit('crearMascota', nuevaMascota, (response) => {
            if (response.estado === 'éxito') {
                setNuevaMascota({
                    clienteId: '',
                    nombre: '',
                    raza: '',
                    edad: '',
                    peso: '',
                });
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleActualizarMascota = () => {
        socket.emit('actualizarMascota', edicion, (response) => {
            if (response.estado === 'éxito') {
                setEdicion(null);
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleEliminarMascota = (id) => {
        socket.emit('eliminarMascota', id, (response) => {
            if (response.estado !== 'éxito') {
                alert(response.mensaje);
            }
        });
    };

    return (
        <div className="mascotas-page">
            <h2 className="titulo">Gestión de Mascotas</h2>
            <button className="btn conectar" onClick={connectSocket} disabled={isConnected}>
                {isConnected ? 'Conectado' : 'Conectar Cliente'}
            </button>

            {isConnected && (
                <>
                    <div className="formulario">
                        <h3>Crear Mascota</h3>
                        <select
                            value={nuevaMascota.clienteId}
                            onChange={(e) => setNuevaMascota({ ...nuevaMascota, cliente: e.target.value })}
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevaMascota.nombre}
                            onChange={(e) => setNuevaMascota({ ...nuevaMascota, nombre: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Raza"
                            value={nuevaMascota.raza}
                            onChange={(e) => setNuevaMascota({ ...nuevaMascota, raza: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Edad"
                            value={nuevaMascota.edad}
                            onChange={(e) => setNuevaMascota({ ...nuevaMascota, edad: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Peso (kg)"
                            value={nuevaMascota.peso}
                            onChange={(e) => setNuevaMascota({ ...nuevaMascota, peso: e.target.value })}
                        />
                        <button className="btn crear" onClick={handleCrearMascota}>Crear</button>
                    </div>

                    {edicion && (
                        <div className="formulario">
                            <h3>Editar Mascota</h3>
                            <select
                                value={edicion.cliente}
                                onChange={(e) => setEdicion({ ...edicion, cliente: e.target.value })}
                            >
                                <option value="">Seleccione un cliente</option>
                                {clientes.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={edicion.nombre}
                                onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Raza"
                                value={edicion.raza}
                                onChange={(e) => setEdicion({ ...edicion, raza: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Edad"
                                value={edicion.edad}
                                onChange={(e) => setEdicion({ ...edicion, edad: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Peso (kg)"
                                value={edicion.peso}
                                onChange={(e) => setEdicion({ ...edicion, peso: e.target.value })}
                            />
                            <button className="btn actualizar" onClick={handleActualizarMascota}>Actualizar</button>
                            <button className="btn cancelar" onClick={() => setEdicion(null)}>Cancelar</button>
                        </div>
                    )}

                    <table className="tabla-mascotas">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Raza</th>
                                <th>Edad</th>
                                <th>Peso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mascotas.map((mascota) => (
                                <tr key={mascota.id}>
                                    <td>{mascota.id}</td>
                                    <td>{mascota.nombre}</td>
                                    <td>{mascota.raza || 'N/A'}</td>
                                    <td>{mascota.edad || 'N/A'}</td>
                                    <td>{mascota.peso || 'N/A'}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => setEdicion(mascota)}>Editar</button>
                                        <button className="btn eliminar" onClick={() => handleEliminarMascota(mascota.id)}>Eliminar</button>
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

export default MascotasPage;
