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
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { NATS_SERVICE } from '../config';

@WebSocketGateway({ cors: true })
export class FacturaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('crearFactura')
  async create(@MessageBody() createFacturaDto: CreateFacturaDto) {
    try {
      console.log('Datos para crear Factura:', createFacturaDto);
      const createdFactura = await firstValueFrom(
        this.client.send({ cmd: 'create-factura' }, createFacturaDto),
      );
      if (!createdFactura) {
        return { estado: 'error', mensaje: 'No se pudo crear la Factura' };
      }

      this.server.emit('facturaCreada', createdFactura);
      return { estado: 'éxito', datos: createdFactura };
    } catch (error) {
      console.error('Error al crear la Factura:', error);
      return { estado: 'error', mensaje: 'No se pudo crear la Factura' };
    }
  }

  @SubscribeMessage('buscarTodasFacturas')
  async findAll() {
    try {
      const facturas = await firstValueFrom(
        this.client.send({ cmd: 'get-facturas' }, {}),
      );
      return { estado: 'éxito', datos: facturas };
    } catch (error) {
      console.error('Error al obtener las Facturas:', error);
      return { estado: 'error', mensaje: 'No se pudieron obtener las Facturas' };
    }
  }

  @SubscribeMessage('buscarFactura')
  async findOne(@MessageBody() id: number) {
    try {
      const factura = await firstValueFrom(
        this.client.send({ cmd: 'get-factura' }, id),
      );
      if (!factura) {
        return { estado: 'error', mensaje: 'Factura no encontrada' };
      }
      return { estado: 'éxito', datos: factura };
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      return { estado: 'error', mensaje: 'No se pudo obtener la Factura' };
    }
  }

  @SubscribeMessage('actualizarFactura')
  async update(@MessageBody() updateFacturaDto: UpdateFacturaDto) {
    try {
      const updatedFactura = await firstValueFrom(
        this.client.send(
          { cmd: 'update-factura' },
          { id: updateFacturaDto.id, ...updateFacturaDto },
        ),
      );
      if (!updatedFactura) {
        return { estado: 'error', mensaje: 'Factura no encontrada o no se pudo actualizar' };
      }
      this.server.emit('facturaActualizada', updatedFactura);
      return { estado: 'éxito', datos: updatedFactura };
    } catch (error) {
      console.error('Error al actualizar la Factura:', error);
      return { estado: 'error', mensaje: 'No se pudo actualizar la Factura' };
    }
  }

  @SubscribeMessage('eliminarFactura')
  async remove(@MessageBody() id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-factura' }, id),
      );
      if (!result) {
        return { estado: 'error', mensaje: 'Factura no encontrada o no se pudo eliminar' };
      }
      this.server.emit('facturaEliminada', { id });
      return { estado: 'éxito', mensaje: 'Factura eliminada correctamente' };
    } catch (error) {
      console.error('Error al eliminar la Factura:', error);
      return { estado: 'error', mensaje: 'No se pudo eliminar la Factura' };
    }
  }
}