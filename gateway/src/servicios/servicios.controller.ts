import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicios.dto';
import { UpdateServicioDto } from './dto/update-servicios.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('servicios')
export class ServiciosController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createServicioDto: CreateServicioDto) {
    try {
      const servicio = await firstValueFrom(
        this.client.send({ cmd: 'create-servicio' }, createServicioDto),
      );
      return servicio;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const servicios = await firstValueFrom(
        this.client.send({ cmd: 'get-servicios' }, {}),
      );
      return servicios;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const servicio = await firstValueFrom(
        this.client.send({ cmd: 'get-servicio' }, id),
      );
      return servicio;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    try {
      const updatedServicio = await firstValueFrom(
        this.client.send({ cmd: 'update-servicio' }, { id, ...updateServicioDto }),
      );
      return updatedServicio;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-servicio' }, id),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}