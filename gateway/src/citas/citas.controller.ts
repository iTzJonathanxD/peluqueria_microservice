import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-citas.dto';
import { UpdateCitaDto } from './dto/update-citas.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('citas')
export class CitasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createCitaDto: CreateCitaDto) {
    try {
      const cita = await firstValueFrom(
        this.client.send({ cmd: 'create-cita' }, createCitaDto),
      );
      return cita;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const citas = await firstValueFrom(
        this.client.send({ cmd: 'get-citas' }, {}),
      );
      return citas;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const cita = await firstValueFrom(
        this.client.send({ cmd: 'get-cita' }, id),
      );
      return cita;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCitaDto: UpdateCitaDto,
  ) {
    try {
      const updatedCita = await firstValueFrom(
        this.client.send({ cmd: 'update-cita' }, { id, ...updateCitaDto }),
      );
      return updatedCita;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-cita' }, id),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
