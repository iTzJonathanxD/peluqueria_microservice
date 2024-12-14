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
  import { CreateCitaDto } from './dto/create-citas.dto';
  import { UpdateCitaDto } from './dto/update-citas.dto';
  import { NATS_SERVICE } from '../config';
  
  @WebSocketGateway({ cors: true })
  export class CitaGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
  
    @SubscribeMessage('crearCita')
    async create(@MessageBody() createCitaDto: CreateCitaDto) {
      try {
        console.log('Datos para crear Cita:', createCitaDto);
        const createdCita = await firstValueFrom(
          this.client.send({ cmd: 'create-cita' }, createCitaDto),
        );
        if (!createdCita) {
          return { estado: 'error', mensaje: 'No se pudo crear la Cita' };
        }
  
        this.server.emit('citaCreada', createdCita);
        return { estado: 'éxito', datos: createdCita };
      } catch (error) {
        console.error('Error al crear la Cita:', error);
        return { estado: 'error', mensaje: 'No se pudo crear la Cita' };
      }
    }
  
    @SubscribeMessage('buscarTodasCitas')
    async findAll() {
      try {
        const citas = await firstValueFrom(
          this.client.send({ cmd: 'get-citas' }, {}),
        );
        return { estado: 'éxito', datos: citas };
      } catch (error) {
        console.error('Error al obtener las Citas:', error);
        return { estado: 'error', mensaje: 'No se pudieron obtener las Citas' };
      }
    }
  
    @SubscribeMessage('buscarCita')
    async findOne(@MessageBody() id: number) {
      try {
        const cita = await firstValueFrom(
          this.client.send({ cmd: 'get-cita' }, id),
        );
        if (!cita) {
          return { estado: 'error', mensaje: 'Cita no encontrada' };
        }
        return { estado: 'éxito', datos: cita };
      } catch (error) {
        console.error('Error al obtener la Cita:', error);
        return { estado: 'error', mensaje: 'No se pudo obtener la Cita' };
      }
    }
  
    @SubscribeMessage('actualizarCita')
    async update(@MessageBody() updateCitaDto: UpdateCitaDto) {
      try {
        const updatedCita = await firstValueFrom(
          this.client.send(
            { cmd: 'update-cita' },
            { id: updateCitaDto.id, ...updateCitaDto },
          ),
        );
        if (!updatedCita) {
          return { estado: 'error', mensaje: 'Cita no encontrada o no se pudo actualizar' };
        }
        this.server.emit('citaActualizada', updatedCita);
        return { estado: 'éxito', datos: updatedCita };
      } catch (error) {
        console.error('Error al actualizar la Cita:', error);
        return { estado: 'error', mensaje: 'No se pudo actualizar la Cita' };
      }
    }
  
    @SubscribeMessage('eliminarCita')
    async remove(@MessageBody() id: number) {
      try {
        const result = await firstValueFrom(
          this.client.send({ cmd: 'delete-cita' }, id),
        );
        if (!result) {
          return { estado: 'error', mensaje: 'Cita no encontrada o no se pudo eliminar' };
        }
        this.server.emit('citaEliminada', { id });
        return { estado: 'éxito', mensaje: 'Cita eliminada correctamente' };
      } catch (error) {
        console.error('Error al eliminar la Cita:', error);
        return { estado: 'error', mensaje: 'No se pudo eliminar la Cita' };
      }
    }
  }
  