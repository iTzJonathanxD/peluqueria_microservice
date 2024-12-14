import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('categorias')
export class CategoriasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = await firstValueFrom(
        this.client.send({ cmd: 'create-categoria' }, createCategoriaDto),
      );
      return categoria;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const categorias = await firstValueFrom(
        this.client.send({ cmd: 'get-categorias' }, {}),
      );
      return categorias;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const categoria = await firstValueFrom(
        this.client.send({ cmd: 'get-categoria' }, id),
      );
      return categoria;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    try {
      const updatedCategoria = await firstValueFrom(
        this.client.send({ cmd: 'update-categoria' }, { id, ...updateCategoriaDto }),
      );
      return updatedCategoria;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-categoria' }, id),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
