import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Servicio } from './entities/servicios.entity';
import { CreateServicioDto } from './dto/create-servicios.dto';
import { UpdateServicioDto } from './dto/update-servicios.dto';
import { NATS_SERVICE } from '../config';

@Resolver(() => Servicio)
export class ServiciosResolver {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Mutation(() => Servicio)
  async createServicio(@Args('createServicioInput') createServicioInput: CreateServicioDto) {
    try {
      const servicio = await firstValueFrom(
        this.client.send({ cmd: 'create-servicio' }, createServicioInput),
      );
      return servicio;
    } catch (error) {
      throw new Error(`Error creando el servicio: ${error.message}`);
    }
  }

  @Query(() => [Servicio], { name: 'servicios' })
  async findAll() {
    try {
      const servicios = await firstValueFrom(
        this.client.send({ cmd: 'get-servicios' }, {}),
      );

      if (!Array.isArray(servicios)) {
        throw new Error('El microservicio no retornó un array de servicios.');
      }

      servicios.forEach((servicio) => {
        if (!servicio.nombre) {
          throw new Error(
            `El campo "nombre" está ausente en el servicio con ID ${servicio.id}.`,
          );
        }
      });

      return servicios;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error(`Error obteniendo los servicios: ${error.message}`);
    }
  }

  @Query(() => Servicio, { name: 'servicio' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const servicio = await firstValueFrom(
        this.client.send({ cmd: 'get-servicio' }, id),
      );
      return servicio;
    } catch (error) {
      throw new Error(`Error obteniendo el servicio con ID ${id}: ${error.message}`);
    }
  }

  @Mutation(() => Servicio)
  async updateServicio(@Args('updateServicioInput') updateServicioInput: UpdateServicioDto) {
    try {
      const updatedServicio = await firstValueFrom(
        this.client.send({ cmd: 'update-servicio' }, { id: updateServicioInput.id, ...updateServicioInput }),
      );
      return updatedServicio;
    } catch (error) {
      throw new Error(`Error actualizando el servicio: ${error.message}`);
    }
  }

  @Mutation(() => Servicio)
  async removeServicio(@Args('id', { type: () => Int }) id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-servicio' }, id),
      );

      if (!result) {
        throw new Error(`No se pudo eliminar el servicio con ID ${id}.`);
      }

      return result;
    } catch (error) {
      console.error(`Error en removeServicio para ID ${id}:`, error);
      throw new Error(`Error eliminando el servicio con ID ${id}: ${error.message}`);
    }
  }
}