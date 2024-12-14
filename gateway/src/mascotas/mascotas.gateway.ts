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
  import { CreateMascotaDto } from './dto/create-cliente.dto';
  import { UpdateMascotaDto } from './dto/update-cliente.dto';
  import { NATS_SERVICE } from '../config';
  
  @WebSocketGateway({ cors: true })
  export class MascotaGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    @SubscribeMessage('crearMascota')
    async create(@MessageBody() createMascotaDto: CreateMascotaDto) {
      try {
        console.log('Datos para crear Mascota:', createMascotaDto);
        const createdMascota = await firstValueFrom(
          this.client.send({ cmd: 'create-mascota' }, createMascotaDto),
        );
        if (!createdMascota) {
          return { estado: 'error', mensaje: 'No se pudo crear la Mascota' };
        }
  
        this.server.emit('mascotaCreada', createdMascota);
        return { estado: 'éxito', datos: createdMascota };
      } catch (error) {
        console.error('Error al crear la Mascota:', error);
        return { estado: 'error', mensaje: 'No se pudo crear la Mascota' };
      }
    }
  
    @SubscribeMessage('buscarTodasMascotas')
    async findAll() {
      try {
        const mascotas = await firstValueFrom(
          this.client.send({ cmd: 'get-mascotas' }, {}),
        );
        return { estado: 'éxito', datos: mascotas };
      } catch (error) {
        console.error('Error al obtener las Mascotas:', error);
        return { estado: 'error', mensaje: 'No se pudieron obtener las Mascotas' };
      }
    }
  
    @SubscribeMessage('buscarMascota')
    async findOne(@MessageBody() id: number) {
      try {
        const mascota = await firstValueFrom(
          this.client.send({ cmd: 'get-mascota' }, id),
        );
        if (!mascota) {
          return { estado: 'error', mensaje: 'Mascota no encontrada' };
        }
        return { estado: 'éxito', datos: mascota };
      } catch (error) {
        console.error('Error al obtener la Mascota:', error);
        return { estado: 'error', mensaje: 'No se pudo obtener la Mascota' };
      }
    }
  
    @SubscribeMessage('actualizarMascota')
    async update(@MessageBody() updateMascotaDto: UpdateMascotaDto) {
      try {
        const updatedMascota = await firstValueFrom(
          this.client.send(
            { cmd: 'update-mascota' },
            { id: updateMascotaDto.id, ...updateMascotaDto },
          ),
        );
        if (!updatedMascota) {
          return { estado: 'error', mensaje: 'Mascota no encontrada o no se pudo actualizar' };
        }
        this.server.emit('mascotaActualizada', updatedMascota);
        return { estado: 'éxito', datos: updatedMascota };
      } catch (error) {
        console.error('Error al actualizar la Mascota:', error);
        return { estado: 'error', mensaje: 'No se pudo actualizar la Mascota' };
      }
    }
  
    @SubscribeMessage('eliminarMascota')
    async remove(@MessageBody() id: number) {
      try {
        const result = await firstValueFrom(
          this.client.send({ cmd: 'delete-mascota' }, id),
        );
        if (!result) {
          return { estado: 'error', mensaje: 'Mascota no encontrada o no se pudo eliminar' };
        }
        this.server.emit('mascotaEliminada', { id });
        return { estado: 'éxito', mensaje: 'Mascota eliminada correctamente' };
      } catch (error) {
        console.error('Error al eliminar la Mascota:', error);
        return { estado: 'error', mensaje: 'No se pudo eliminar la Mascota' };
      }
    }
  }
  