import React, { useState, useEffect } from 'react';
import socket from '../services/socketService';
import './css/CategoriasPage.css';

const ServiciosPage = () => {
    const [servicios, setServicios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevoServicio, setNuevoServicio] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion: '',
        categoriaId: '',
    });
    const [edicion, setEdicion] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = () => {
        if (!isConnected) {
            socket.emit('buscarTodosServicios', null, (response) => {
                if (response.estado === 'éxito') {
                    setServicios(response.datos);
                }
            });

            // Cargar categorías disponibles
            socket.emit('buscarTodasCategorias', null, (response) => {
                if (response.estado === 'éxito') {
                    setCategorias(response.datos);
                }
            });

            // Escuchar actualizaciones en tiempo real
            socket.on('servicioActualizado', (servicio) => {
                setServicios((prev) => prev.map((s) => (s.id === servicio.id ? servicio : s)));
            });

            socket.on('servicioCreado', (servicio) => {
                setServicios((prev) => [...prev, servicio]);
            });

            socket.on('servicioEliminado', ({ id }) => {
                setServicios((prev) => prev.filter((s) => s.id !== id));
            });

            setIsConnected(true);
        }
    };

    useEffect(() => {
        return () => {
            socket.off('servicioActualizado');
            socket.off('servicioCreado');
            socket.off('servicioEliminado');
            setIsConnected(false);
        };
    }, []);

    const handleCrearServicio = () => {
        socket.emit('crearServicio', nuevoServicio, (response) => {
            if (response.estado === 'éxito') {
                setNuevoServicio({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    duracion: '',
                    categoriaId: '',
                });
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleActualizarServicio = () => {
        socket.emit('actualizarServicio', edicion, (response) => {
            if (response.estado === 'éxito') {
                setEdicion(null);
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleEliminarServicio = (id) => {
        socket.emit('eliminarServicio', id, (response) => {
            if (response.estado !== 'éxito') {
                alert(response.mensaje);
            }
        });
    };

    return (
        <div className="servicios-page">
            <h2 className="titulo">Gestión de Servicios</h2>
            <button className="btn conectar" onClick={connectSocket} disabled={isConnected}>
                {isConnected ? 'Conectado' : 'Conectar Cliente'}
            </button>

            {isConnected && (
                <>
                    <div className="formulario">
                        <h3>Crear Servicio</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoServicio.nombre}
                            onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={nuevoServicio.descripcion}
                            onChange={(e) => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={nuevoServicio.precio}
                            onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Duración (minutos)"
                            value={nuevoServicio.duracion}
                            onChange={(e) => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })}
                        />
                        <select
                            value={nuevoServicio.categoriaId}
                            onChange={(e) => setNuevoServicio({ ...nuevoServicio, categoria: e.target.value })}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        <button className="btn crear" onClick={handleCrearServicio}>Crear</button>
                    </div>

                    {edicion && (
                        <div className="formulario">
                            <h3>Editar Servicio</h3>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={edicion.nombre}
                                onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={edicion.descripcion}
                                onChange={(e) => setEdicion({ ...edicion, descripcion: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Precio"
                                value={edicion.precio}
                                onChange={(e) => setEdicion({ ...edicion, precio: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Duración (minutos)"
                                value={edicion.duracion}
                                onChange={(e) => setEdicion({ ...edicion, duracion: e.target.value })}
                            />
                            <select
                                value={edicion.categoria}
                                onChange={(e) => setEdicion({ ...edicion, categoria: e.target.value })}
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                            <button className="btn actualizar" onClick={handleActualizarServicio}>Actualizar</button>
                            <button className="btn cancelar" onClick={() => setEdicion(null)}>Cancelar</button>
                        </div>
                    )}

                    <table className="tabla-servicios">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Duración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicios.map((servicio) => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.descripcion || 'N/A'}</td>
                                    <td>{servicio.precio}</td>
                                    <td>{servicio.duracion} min</td>
                                    <td>
                                        <button className="btn editar" onClick={() => setEdicion(servicio)}>Editar</button>
                                        <button className="btn eliminar" onClick={() => handleEliminarServicio(servicio.id)}>Eliminar</button>
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

export default ServiciosPage;
