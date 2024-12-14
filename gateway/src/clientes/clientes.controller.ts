import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    try {
      const cliente = await firstValueFrom(
        this.client.send({ cmd: 'create-cliente' }, createClienteDto),
      );
      return cliente;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const clientes = await firstValueFrom(
        this.client.send({ cmd: 'get-clientes' }, {}),
      );
      return clientes;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const cliente = await firstValueFrom(
        this.client.send({ cmd: 'get-cliente' }, id),
      );
      return cliente;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    try {
      const updatedCliente = await firstValueFrom(
        this.client.send({ cmd: 'update-cliente' }, { id, ...updateClienteDto }),
      );
      return updatedCliente;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-cliente' }, id),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
