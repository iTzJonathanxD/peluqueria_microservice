import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Factura } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { NATS_SERVICE } from '../config';

@Resolver(() => Factura)
export class FacturasResolver {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Mutation(() => Factura)
  async createFactura(@Args('createFacturaInput') createFacturaInput: CreateFacturaDto) {
    try {
      const factura = await firstValueFrom(
        this.client.send({ cmd: 'create-factura' }, createFacturaInput),
      );
      return factura;
    } catch (error) {
      throw new Error(`Error creando la factura: ${error.message}`);
    }
  }

  @Query(() => [Factura], { name: 'facturas' })
  async findAll() {
    try {
      const facturas = await firstValueFrom(
        this.client.send({ cmd: 'get-facturas' }, {}),
      );

      if (!Array.isArray(facturas)) {
        throw new Error('El microservicio no retornó un array de facturas.');
      }

      facturas.forEach((factura) => {
        if (!factura.montoTotal) {
          throw new Error(
            `El campo "montoTotal" está ausente en la factura con ID ${factura.id}.`,
          );
        }
      });

      return facturas;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error(`Error obteniendo las facturas: ${error.message}`);
    }
  }

  @Query(() => Factura, { name: 'factura' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const factura = await firstValueFrom(
        this.client.send({ cmd: 'get-factura' }, id),
      );
      return factura;
    } catch (error) {
      throw new Error(`Error obteniendo la factura con ID ${id}: ${error.message}`);
    }
  }

  @Mutation(() => Factura)
  async updateFactura(@Args('updateFacturaInput') updateFacturaInput: UpdateFacturaDto) {
    try {
      const updatedFactura = await firstValueFrom(
        this.client.send({ cmd: 'update-factura' }, { id: updateFacturaInput.id, ...updateFacturaInput }),
      );
      return updatedFactura;
    } catch (error) {
      throw new Error(`Error actualizando la factura: ${error.message}`);
    }
  }

  @Mutation(() => Factura)
  async removeFactura(@Args('id', { type: () => Int }) id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-factura' }, id),
      );
  
      if (!result) {
        throw new Error(`No se pudo eliminar la factura con ID ${id}.`);
      }
  
      return result;
    } catch (error) {
      console.error(`Error en removeFactura para ID ${id}:`, error);
      throw new Error(`Error eliminando la factura con ID ${id}: ${error.message}`);
    }
  }
}