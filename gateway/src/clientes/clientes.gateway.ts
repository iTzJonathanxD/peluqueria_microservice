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
  import { CreateClienteDto } from './dto/create-cliente.dto';
  import { UpdateClienteDto } from './dto/update-cliente.dto';
  import { NATS_SERVICE } from '../config';
  
  @WebSocketGateway({ cors: true })
  export class ClienteGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
  
    @SubscribeMessage('crearCliente')
    async create(@MessageBody() createClienteDto: CreateClienteDto) {
      try {
        console.log('Datos para crear Cliente:', createClienteDto);
        const createdCliente = await firstValueFrom(
          this.client.send({ cmd: 'create-cliente' }, createClienteDto),
        );
        if (!createdCliente) {
          return { estado: 'error', mensaje: 'No se pudo crear el Cliente' };
        }
  
        this.server.emit('clienteCreado', createdCliente);
        return { estado: 'éxito', datos: createdCliente };
      } catch (error) {
        console.error('Error al crear el Cliente:', error);
        return { estado: 'error', mensaje: 'No se pudo crear el Cliente' };
      }
    }
  
    @SubscribeMessage('buscarTodosClientes')
    async findAll() {
      try {
        const clientes = await firstValueFrom(
          this.client.send({ cmd: 'get-clientes' }, {}),
        );
        return { estado: 'éxito', datos: clientes };
      } catch (error) {
        console.error('Error al obtener los Clientes:', error);
        return { estado: 'error', mensaje: 'No se pudieron obtener los Clientes' };
      }
    }
  
    @SubscribeMessage('buscarCliente')
    async findOne(@MessageBody() id: number) {
      try {
        const cliente = await firstValueFrom(
          this.client.send({ cmd: 'get-cliente' }, id),
        );
        if (!cliente) {
          return { estado: 'error', mensaje: 'Cliente no encontrado' };
        }
        return { estado: 'éxito', datos: cliente };
      } catch (error) {
        console.error('Error al obtener el Cliente:', error);
        return { estado: 'error', mensaje: 'No se pudo obtener el Cliente' };
      }
    }
  
    @SubscribeMessage('actualizarCliente')
    async update(@MessageBody() updateClienteDto: UpdateClienteDto) {
      try {
        const updatedCliente = await firstValueFrom(
          this.client.send(
            { cmd: 'update-cliente' },
            { id: updateClienteDto.id, ...updateClienteDto },
          ),
        );
        if (!updatedCliente) {
          return { estado: 'error', mensaje: 'Cliente no encontrado o no se pudo actualizar' };
        }
        this.server.emit('clienteActualizado', updatedCliente);
        return { estado: 'éxito', datos: updatedCliente };
      } catch (error) {
        console.error('Error al actualizar el Cliente:', error);
        return { estado: 'error', mensaje: 'No se pudo actualizar el Cliente' };
      }
    }
  
    @SubscribeMessage('eliminarCliente')
    async remove(@MessageBody() id: number) {
      try {
        const result = await firstValueFrom(
          this.client.send({ cmd: 'delete-cliente' }, id),
        );
        if (!result) {
          return { estado: 'error', mensaje: 'Cliente no encontrado o no se pudo eliminar' };
        }
        this.server.emit('clienteEliminado', { id });
        return { estado: 'éxito', mensaje: 'Cliente eliminado correctamente' };
      } catch (error) {
        console.error('Error al eliminar el Cliente:', error);
        return { estado: 'error', mensaje: 'No se pudo eliminar el Cliente' };
      }
    }
  }
  