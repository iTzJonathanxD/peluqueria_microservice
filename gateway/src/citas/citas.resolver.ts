import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Cita } from './entities/citas.entity';
import { CreateCitaDto } from './dto/create-citas.dto';
import { UpdateCitaDto } from './dto/update-citas.dto';
import { NATS_SERVICE } from '../config';

@Resolver(() => Cita)
export class CitasResolver {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Mutation(() => Cita)
  async createCita(@Args('createCitaInput') createCitaInput: CreateCitaDto) {
    try {
      const cita = await firstValueFrom(
        this.client.send({ cmd: 'create-cita' }, createCitaInput),
      );
      return cita;
    } catch (error) {
      throw new Error(`Error creando la cita: ${error.message}`);
    }
  }

  @Query(() => [Cita], { name: 'citas' })
  async findAll() {
    try {
      const citas = await firstValueFrom(
        this.client.send({ cmd: 'get-citas' }, {}),
      );

      if (!Array.isArray(citas)) {
        throw new Error('El microservicio no retornó un array de citas.');
      }

      citas.forEach((cita) => {
        if (!cita.fechaCita) {
          throw new Error(
            `El campo "fechaCita" está ausente en la cita con ID ${cita.id}.`,
          );
        }
      });

      return citas;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error(`Error obteniendo las citas: ${error.message}`);
    }
  }

  @Query(() => Cita, { name: 'cita' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const cita = await firstValueFrom(
        this.client.send({ cmd: 'get-cita' }, id),
      );
      return cita;
    } catch (error) {
      throw new Error(`Error obteniendo la cita con ID ${id}: ${error.message}`);
    }
  }

  @Mutation(() => Cita)
  async updateCita(@Args('updateCitaInput') updateCitaInput: UpdateCitaDto) {
    try {
      const updatedCita = await firstValueFrom(
        this.client.send({ cmd: 'update-cita' }, { id: updateCitaInput.id, ...updateCitaInput }),
      );
      return updatedCita;
    } catch (error) {
      throw new Error(`Error actualizando la cita: ${error.message}`);
    }
  }

  @Mutation(() => Cita)
  async removeCita(@Args('id', { type: () => Int }) id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-cita' }, id),
      );

      if (!result) {
        throw new Error(`No se pudo eliminar la cita con ID ${id}.`);
      }

      return result;
    } catch (error) {
      console.error(`Error en removeCita para ID ${id}:`, error);
      throw new Error(`Error eliminando la cita con ID ${id}: ${error.message}`);
    }
  }
}
