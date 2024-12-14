import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { NATS_SERVICE } from '../config';

@Resolver(() => Categoria)
export class CategoriasResolver {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Mutation(() => Categoria)
  async createCategoria(@Args('createCategoriaInput') createCategoriaInput: CreateCategoriaDto) {
    try {
      const categoria = await firstValueFrom(
        this.client.send({ cmd: 'create-categoria' }, createCategoriaInput),
      );
      return categoria;
    } catch (error) {
      throw new Error(`Error creando la categoría: ${error.message}`);
    }
  }

  @Query(() => [Categoria], { name: 'categorias' })
async findAll() {
  try {
    // Llama al microservicio para obtener las categorías
    const categorias = await firstValueFrom(
      this.client.send({ cmd: 'get-categorias' }, {}),
    );

    if (!Array.isArray(categorias)) {
      throw new Error('El microservicio no retornó un array de categorías.');
    }

    categorias.forEach((categoria) => {
      if (!categoria.nombre) {
        throw new Error(
          `El campo "nombre" está ausente en la categoría con ID ${categoria.id}.`,
        );
      }
    });

    return categorias;
  } catch (error) {
    console.error('Error en findAll:', error);
    throw new Error(`Error obteniendo las categorías: ${error.message}`);
  }
}

  

  @Query(() => Categoria, { name: 'categoria' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      const categoria = await firstValueFrom(
        this.client.send({ cmd: 'get-categoria' }, id),
      );
      return categoria;
    } catch (error) {
      throw new Error(`Error obteniendo la categoría con ID ${id}: ${error.message}`);
    }
  }

  @Mutation(() => Categoria)
  async updateCategoria(@Args('updateCategoriaInput') updateCategoriaInput: UpdateCategoriaDto) {
    try {
      const updatedCategoria = await firstValueFrom(
        this.client.send({ cmd: 'update-categoria' }, { id: updateCategoriaInput.id, ...updateCategoriaInput }),
      );
      return updatedCategoria;
    } catch (error) {
      throw new Error(`Error actualizando la categoría: ${error.message}`);
    }
  }

  @Mutation(() => Categoria)
  async removeCategoria(@Args('id', { type: () => Int }) id: number) {
    try {
      const result = await firstValueFrom(
        this.client.send({ cmd: 'delete-categoria' }, id),
      );
  
      if (!result) {
        throw new Error(`No se pudo eliminar la categoría con ID ${id}.`);
      }
  
      return result;
    } catch (error) {
      console.error(`Error en removeCategoria para ID ${id}:`, error);
      throw new Error(`Error eliminando la categoría con ID ${id}: ${error.message}`);
    }
  }
  
}
