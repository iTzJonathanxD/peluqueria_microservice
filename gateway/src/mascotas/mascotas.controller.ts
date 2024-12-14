import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-cliente.dto';
import { UpdateMascotaDto } from './dto/update-cliente.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mascotas')
export class MascotasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createMascotaDto: CreateMascotaDto) {
    try {
      const mascota = await firstValueFrom(
        this.client.send({ cmd: 'create-mascota' }, createMascotaDto),
      );
      return mascota;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const mascotas = await firstValueFrom(
        this.client.send({ cmd: 'get-mascotas' }, {}),
      );
      return mascotas;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const mascota = await firstValueFrom(
        this.client.send({ cmd: 'get-mascota' }, id),
      );
      return mascota;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMascotaDto: UpdateMascotaDto,
  ) {
    try {
      const updatedMascota = await firstValueFrom(
        this.client.send({ cmd: 'update-mascota' }, { id, ...updateMascotaDto }),
      );
      return updatedMascota;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-mascota' }, id),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
