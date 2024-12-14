import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('facturas')
export class FacturasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createFacturaDto: CreateFacturaDto) {
    try {
      const factura = await firstValueFrom(
        this.client.send({ cmd: 'create-factura' }, createFacturaDto),
      );
      return factura;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const facturas = await firstValueFrom(
        this.client.send({ cmd: 'get-facturas' }, {}),
      );
      return facturas;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const factura = await firstValueFrom(
        this.client.send({ cmd: 'get-factura' }, id),
      );
      return factura;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateFacturaDto: UpdateFacturaDto,
  ) {
    try {
      const updatedFactura = await firstValueFrom(
        this.client.send({ cmd: 'update-factura' }, { id, ...updateFacturaDto }),
      );
      return updatedFactura;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-factura' }, id),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
