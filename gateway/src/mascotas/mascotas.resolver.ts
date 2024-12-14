import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto } from './dto/create-cliente.dto';
import { UpdateMascotaDto } from './dto/update-cliente.dto';
import { NATS_SERVICE } from '../config';

@Resolver(() => Mascota)
export class MascotasResolver {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Mutation(() => Mascota)
  async createMascota(@Args('createMascotaInput') createMascotaInput: CreateMascotaDto) {
    try {
      const mascota = await firstValueFrom(
        this.client.send({ cmd: 'create-mascota' }, createMascotaInput),
      );
      return mascota;
    } catch (error) {
      throw new Error(`Error creando la mascota: ${error.message}`);
    }
  }

  @Query(() => [Mascota], { name: 'mascotas' })
  async findAll() {
    try {
      const mascotas = await firstValueFrom(
        this.client.send({ cmd: 'get-mascotas' }, {}),
      );

      if (!Array.isArray(mascotas)) {
        throw new Error('El microservicio no retornó un array de mascotas.');
      }

      mascotas.forEach((mascota) => {
        if (!mascota.nombre) {
          throw new Error(
            `El campo "nombre" está ausente en la mascota con ID ${mascota.id}.`,
          );
        }
      });

      return mascotas;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error(`Error obteniendo las mascotas: ${error.message}`);
    }
  }

  @Query(() => Mascota, { name: 'mascota' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const mascota = await firstValueFrom(
        this.client.send({ cmd: 'get-mascota' }, id),
      );
      return mascota;
    } catch (error) {
      throw new Error(`Error obteniendo la mascota con ID ${id}: ${error.message}`);
    }
  }

  @Mutation(() => Mascota)
  async updateMascota(@Args('updateMascotaInput') updateMascotaInput: UpdateMascotaDto) {
    try {
      const updatedMascota = await firstValueFrom(
        this.client.send({ cmd: 'update-mascota' }, { id: updateMascotaInput.id, ...updateMascotaInput }),
      );
      return updatedMascota;
    } catch (error) {
      throw new Error(`Error actualizando la mascota: ${error.message}`);
    }
  }

  @Mutation(() => Mascota)
  async removeMascota(@Args('id', { type: () => Int }) id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-mascota' }, id),
      );

      if (!result) {
        throw new Error(`No se pudo eliminar la mascota con ID ${id}.`);
      }

      return result;
    } catch (error) {
      console.error(`Error en removeMascota para ID ${id}:`, error);
      throw new Error(`Error eliminando la mascota con ID ${id}: ${error.message}`);
    }
  }
}
