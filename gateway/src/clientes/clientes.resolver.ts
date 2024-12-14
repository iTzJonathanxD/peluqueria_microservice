import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { NATS_SERVICE } from '../config';

@Resolver(() => Cliente)
export class ClientesResolver {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Mutation(() => Cliente)
  async createCliente(@Args('createClienteInput') createClienteInput: CreateClienteDto) {
    try {
      const cliente = await firstValueFrom(
        this.client.send({ cmd: 'create-cliente' }, createClienteInput),
      );
      return cliente;
    } catch (error) {
      throw new Error(`Error creando el cliente: ${error.message}`);
    }
  }

  @Query(() => [Cliente], { name: 'clientes' })
  async findAll() {
    try {
      const clientes = await firstValueFrom(
        this.client.send({ cmd: 'get-clientes' }, {}),
      );

      if (!Array.isArray(clientes)) {
        throw new Error('El microservicio no retornó un array de clientes.');
      }

      clientes.forEach((cliente) => {
        if (!cliente.nombre) {
          throw new Error(
            `El campo "nombre" está ausente en el cliente con ID ${cliente.id}.`,
          );
        }
      });

      return clientes;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error(`Error obteniendo los clientes: ${error.message}`);
    }
  }

  @Query(() => Cliente, { name: 'cliente' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const cliente = await firstValueFrom(
        this.client.send({ cmd: 'get-cliente' }, id),
      );
      return cliente;
    } catch (error) {
      throw new Error(`Error obteniendo el cliente con ID ${id}: ${error.message}`);
    }
  }

  @Mutation(() => Cliente)
  async updateCliente(@Args('updateClienteInput') updateClienteInput: UpdateClienteDto) {
    try {
      const updatedCliente = await firstValueFrom(
        this.client.send({ cmd: 'update-cliente' }, { id: updateClienteInput.id, ...updateClienteInput }),
      );
      return updatedCliente;
    } catch (error) {
      throw new Error(`Error actualizando el cliente: ${error.message}`);
    }
  }

  @Mutation(() => Cliente)
  async removeCliente(@Args('id', { type: () => Int }) id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-cliente' }, id),
      );

      if (!result) {
        throw new Error(`No se pudo eliminar el cliente con ID ${id}.`);
      }

      return result;
    } catch (error) {
      console.error(`Error en removeCliente para ID ${id}:`, error);
      throw new Error(`Error eliminando el cliente con ID ${id}: ${error.message}`);
    }
  }
}
