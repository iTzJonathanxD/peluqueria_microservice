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
import { CreateServicioDto } from './dto/create-servicios.dto';
import { UpdateServicioDto } from './dto/update-servicios.dto';
import { NATS_SERVICE } from '../config';

@WebSocketGateway({ cors: true })
export class ServicioGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('crearServicio')
  async create(@MessageBody() createServicioDto: CreateServicioDto) {
    try {
      console.log('Datos para crear Servicio:', createServicioDto);
      const createdServicio = await firstValueFrom(
        this.client.send({ cmd: 'create-servicio' }, createServicioDto),
      );
      if (!createdServicio) {
        return { estado: 'error', mensaje: 'No se pudo crear el Servicio' };
      }

      this.server.emit('servicioCreado', createdServicio);
      return { estado: 'éxito', datos: createdServicio };
    } catch (error) {
      console.error('Error al crear el Servicio:', error);
      return { estado: 'error', mensaje: 'No se pudo crear el Servicio' };
    }
  }

  @SubscribeMessage('buscarTodosServicios')
  async findAll() {
    try {
      const servicios = await firstValueFrom(
        this.client.send({ cmd: 'get-servicios' }, {}),
      );
      return { estado: 'éxito', datos: servicios };
    } catch (error) {
      console.error('Error al obtener los Servicios:', error);
      return { estado: 'error', mensaje: 'No se pudieron obtener los Servicios' };
    }
  }

  @SubscribeMessage('buscarServicio')
  async findOne(@MessageBody() id: number) {
    try {
      const servicio = await firstValueFrom(
        this.client.send({ cmd: 'get-servicio' }, id),
      );
      if (!servicio) {
        return { estado: 'error', mensaje: 'Servicio no encontrado' };
      }
      return { estado: 'éxito', datos: servicio };
    } catch (error) {
      console.error('Error al obtener el Servicio:', error);
      return { estado: 'error', mensaje: 'No se pudo obtener el Servicio' };
    }
  }

  @SubscribeMessage('actualizarServicio')
  async update(@MessageBody() updateServicioDto: UpdateServicioDto) {
    try {
      const updatedServicio = await firstValueFrom(
        this.client.send(
          { cmd: 'update-servicio' },
          { id: updateServicioDto.id, ...updateServicioDto },
        ),
      );
      if (!updatedServicio) {
        return { estado: 'error', mensaje: 'Servicio no encontrado o no se pudo actualizar' };
      }
      this.server.emit('servicioActualizado', updatedServicio);
      return { estado: 'éxito', datos: updatedServicio };
    } catch (error) {
      console.error('Error al actualizar el Servicio:', error);
      return { estado: 'error', mensaje: 'No se pudo actualizar el Servicio' };
    }
  }

  @SubscribeMessage('eliminarServicio')
  async remove(@MessageBody() id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-servicio' }, id),
      );
      if (!result) {
        return { estado: 'error', mensaje: 'Servicio no encontrado o no se pudo eliminar' };
      }
      this.server.emit('servicioEliminado', { id });
      return { estado: 'éxito', mensaje: 'Servicio eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar el Servicio:', error);
      return { estado: 'error', mensaje: 'No se pudo eliminar el Servicio' };
    }
  }
}
