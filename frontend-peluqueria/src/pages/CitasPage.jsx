import React, { useState, useEffect } from 'react';
import socket from '../services/socketService';
import './css/CategoriasPage.css';

const CitasPage = () => {
    const [citas, setCitas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [nuevaCita, setNuevaCita] = useState({
        clienteId: '',
        mascotaId: '',
        servicioId: '',
        fechaCita: '',
        estado: 'pendiente',
    });
    const [edicion, setEdicion] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = () => {
        if (!isConnected) {
            socket.emit('buscarTodasCitas', null, (response) => {
                if (response.estado === 'éxito') {
                    setCitas(response.datos);
                }
            });

            // Cargar listas iniciales de clientes, mascotas y servicios
            socket.emit('buscarTodosClientes', null, (response) => {
                if (response.estado === 'éxito') {
                    setClientes(response.datos);
                }
            });

            socket.emit('buscarTodasMascotas', null, (response) => {
                if (response.estado === 'éxito') {
                    setMascotas(response.datos);
                }
            });

            socket.emit('buscarTodosServicios', null, (response) => {
                if (response.estado === 'éxito') {
                    setServicios(response.datos);
                }
            });

            // Escuchar actualizaciones en tiempo real
            socket.on('citaActualizada', (cita) => {
                setCitas((prev) => prev.map((c) => (c.id === cita.id ? cita : c)));
            });

            socket.on('citaCreada', (cita) => {
                setCitas((prev) => [...prev, cita]);
            });

            socket.on('citaEliminada', ({ id }) => {
                setCitas((prev) => prev.filter((c) => c.id !== id));
            });

            setIsConnected(true);
        }
    };

    useEffect(() => {
        return () => {
            socket.off('citaActualizada');
            socket.off('citaCreada');
            socket.off('citaEliminada');
            setIsConnected(false);
        };
    }, []);

    const handleCrearCita = () => {
        // Validar datos antes de enviar
        if (!nuevaCita.clienteId || !nuevaCita.mascotaId || !nuevaCita.servicioId || !nuevaCita.fechaCita) {
            alert("Por favor completa todos los campos.");
            return;
        }

        socket.emit('crearCita', nuevaCita, (response) => {
            if (response.estado === 'éxito') {
                setNuevaCita({
                    clienteId: '',
                    mascotaId: '',
                    servicioId: '',
                    fechaCita: '',
                    estado: 'pendiente',
                });
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleActualizarCita = () => {
        if (!edicion.clienteId || !edicion.mascotaId || !edicion.servicioId || !edicion.fechaCita) {
            alert("Por favor completa todos los campos.");
            return;
        }

        socket.emit('actualizarCita', edicion, (response) => {
            if (response.estado === 'éxito') {
                setEdicion(null);
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleEliminarCita = (id) => {
        socket.emit('eliminarCita', id, (response) => {
            if (response.estado !== 'éxito') {
                alert(response.mensaje);
            }
        });
    };

    return (
        <div className="citas-page">
            <h2 className="titulo">Gestión de Citas</h2>
            <button className="btn conectar" onClick={connectSocket} disabled={isConnected}>
                {isConnected ? 'Conectado' : 'Conectar Cliente'}
            </button>

            {isConnected && (
                <>
                    <div className="formulario">
                        <h3>Crear Cita</h3>
                        <select
                            value={nuevaCita.clienteId}
                            onChange={(e) => setNuevaCita({ ...nuevaCita, clienteId: e.target.value })}
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>

                        <select
                            value={nuevaCita.mascotaId}
                            onChange={(e) => setNuevaCita({ ...nuevaCita, mascotaId: e.target.value })}
                        >
                            <option value="">Seleccione una mascota</option>
                            {mascotas.map((mascota) => (
                                <option key={mascota.id} value={mascota.id}>
                                    {mascota.nombre}
                                </option>
                            ))}
                        </select>

                        <select
                            value={nuevaCita.servicioId}
                            onChange={(e) => setNuevaCita({ ...nuevaCita, servicioId: e.target.value })}
                        >
                            <option value="">Seleccione un servicio</option>
                            {servicios.map((servicio) => (
                                <option key={servicio.id} value={servicio.id}>
                                    {servicio.nombre}
                                </option>
                            ))}
                        </select>

                        <input
                            type="datetime-local"
                            placeholder="Fecha de la cita"
                            value={nuevaCita.fechaCita}
                            onChange={(e) => setNuevaCita({ ...nuevaCita, fechaCita: e.target.value })}
                        />
                        <select
                            value={nuevaCita.estado}
                            onChange={(e) => setNuevaCita({ ...nuevaCita, estado: e.target.value })}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                        <button className="btn crear" onClick={handleCrearCita}>Crear</button>
                    </div>

                    <table className="tabla-citas">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita) => (
                                <tr key={cita.id}>
                                    <td>{cita.id}</td>
                                    <td>{new Date(cita.fechaCita).toLocaleString()}</td>
                                    <td>{cita.estado}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => setEdicion(cita)}>Editar</button>
                                        <button className="btn eliminar" onClick={() => handleEliminarCita(cita.id)}>Eliminar</button>
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

export default CitasPage;
