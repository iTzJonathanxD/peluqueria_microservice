import React, { useState, useEffect } from 'react';
import socket from '../services/socketService';
import './css/CategoriasPage.css';

const CategoriasPage = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
    const [edicion, setEdicion] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectSocket = () => {
        if (!isConnected) {
            // Escuchar el evento de categorías desde el servidor
            socket.emit('buscarTodasCategorias', null, (response) => {
                if (response.estado === 'éxito') {
                    setCategorias(response.datos);
                }
            });

            // Escuchar actualizaciones en tiempo real
            socket.on('categoriaActualizada', (categoria) => {
                setCategorias((prev) => prev.map((c) => (c.id === categoria.id ? categoria : c)));
            });

            socket.on('categoriaCreada', (categoria) => {
                setCategorias((prev) => [...prev, categoria]);
            });

            socket.on('categoriaEliminada', ({ id }) => {
                setCategorias((prev) => prev.filter((c) => c.id !== id));
            });

            setIsConnected(true);
        }
    };

    useEffect(() => {
        return () => {
            // Limpiar eventos cuando se desconecta
            socket.off('categoriaActualizada');
            socket.off('categoriaCreada');
            socket.off('categoriaEliminada');
            setIsConnected(false);
        };
    }, []);

    const handleCrearCategoria = () => {
        socket.emit('crearCategoria', nuevaCategoria, (response) => {
            if (response.estado === 'éxito') {
                setNuevaCategoria({ nombre: '', descripcion: '' });
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleActualizarCategoria = () => {
        socket.emit('actualizarCategoria', edicion, (response) => {
            if (response.estado === 'éxito') {
                setEdicion(null);
            } else {
                alert(response.mensaje);
            }
        });
    };

    const handleEliminarCategoria = (id) => {
        socket.emit('eliminarCategoria', id, (response) => {
            if (response.estado !== 'éxito') {
                alert(response.mensaje);
            }
        });
    };

    return (
        <div className="categorias-page">
            <h2 className="titulo">Gestión de Categorías</h2>
            <button className="btn conectar" onClick={connectSocket} disabled={isConnected}>
                {isConnected ? 'Conectado' : 'Conectar Cliente'}
            </button>

            {isConnected && (
                <>
                    <div className="formulario">
                        <h3>Crear Categoría</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevaCategoria.nombre}
                            onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={nuevaCategoria.descripcion}
                            onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
                        />
                        <button className="btn crear" onClick={handleCrearCategoria}>Crear</button>
                    </div>

                    {edicion && (
                        <div className="formulario">
                            <h3>Editar Categoría</h3>
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
                            <button className="btn actualizar" onClick={handleActualizarCategoria}>Actualizar</button>
                            <button className="btn cancelar" onClick={() => setEdicion(null)}>Cancelar</button>
                        </div>
                    )}

                    <table className="tabla-categorias">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td>{categoria.id}</td>
                                    <td>{categoria.nombre}</td>
                                    <td>{categoria.descripcion || 'N/A'}</td>
                                    <td>
                                        <button className="btn editar" onClick={() => setEdicion(categoria)}>Editar</button>
                                        <button className="btn eliminar" onClick={() => handleEliminarCategoria(categoria.id)}>Eliminar</button>
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

export default CategoriasPage;
