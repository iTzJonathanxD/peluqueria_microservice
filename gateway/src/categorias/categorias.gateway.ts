import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { NATS_SERVICE } from '../config';

@WebSocketGateway({ cors: true })
export class CategoriaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Socket>();

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  handleConnection(client: Socket) {
    if (this.connectedClients.has(client.id)) {
      console.log(`Cliente ya conectado: ${client.id}`);
      return;
    }
    console.log(`Cliente conectado: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    if (this.connectedClients.has(client.id)) {
      console.log(`Cliente desconectado: ${client.id}`);
      this.connectedClients.delete(client.id);
    }
  }

  @SubscribeMessage('crearCategoria')
  async create(@MessageBody() createCategoriaDto: CreateCategoriaDto) {
    try {
      console.log('Datos para crear Categoría:', createCategoriaDto);
      const createdCategoria = await firstValueFrom(
        this.client.send({ cmd: 'create-categoria' }, createCategoriaDto),
      );
      if (!createdCategoria) {
        return { estado: 'error', mensaje: 'No se pudo crear la Categoría' };
      }

      this.server.emit('categoriaCreada', createdCategoria);
      return { estado: 'éxito', datos: createdCategoria };
    } catch (error) {
      console.error('Error al crear la Categoría:', error);
      return { estado: 'error', mensaje: 'No se pudo crear la Categoría' };
    }
  }

  @SubscribeMessage('buscarTodasCategorias')
  async findAll() {
    try {
      const categorias = await firstValueFrom(
        this.client.send({ cmd: 'get-categorias' }, {}),
      );
      return { estado: 'éxito', datos: categorias };
    } catch (error) {
      console.error('Error al obtener las Categorías:', error);
      return { estado: 'error', mensaje: 'No se pudieron obtener las Categorías' };
    }
  }

  @SubscribeMessage('buscarCategoria')
  async findOne(@MessageBody() id: number) {
    try {
      const categoria = await firstValueFrom(
        this.client.send({ cmd: 'get-categoria' }, id),
      );
      if (!categoria) {
        return { estado: 'error', mensaje: 'Categoría no encontrada' };
      }
      return { estado: 'éxito', datos: categoria };
    } catch (error) {
      console.error('Error al obtener la Categoría:', error);
      return { estado: 'error', mensaje: 'No se pudo obtener la Categoría' };
    }
  }

  @SubscribeMessage('actualizarCategoria')
  async update(@MessageBody() updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const updatedCategoria = await firstValueFrom(
        this.client.send(
          { cmd: 'update-categoria' },
          { id: updateCategoriaDto.id, ...updateCategoriaDto },
        ),
      );
      if (!updatedCategoria) {
        return { estado: 'error', mensaje: 'Categoría no encontrada o no se pudo actualizar' };
      }
      this.server.emit('categoriaActualizada', updatedCategoria);
      return { estado: 'éxito', datos: updatedCategoria };
    } catch (error) {
      console.error('Error al actualizar la Categoría:', error);
      return { estado: 'error', mensaje: 'No se pudo actualizar la Categoría' };
    }
  }

  @SubscribeMessage('eliminarCategoria')
  async remove(@MessageBody() id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-categoria' }, id),
      );
      if (!result) {
        return { estado: 'error', mensaje: 'Categoría no encontrada o no se pudo eliminar' };
      }
      this.server.emit('categoriaEliminada', { id });
      return { estado: 'éxito', mensaje: 'Categoría eliminada correctamente' };
    } catch (error) {
      console.error('Error al eliminar la Categoría:', error);
      return { estado: 'error', mensaje: 'No se pudo eliminar la Categoría' };
    }
  }
}
