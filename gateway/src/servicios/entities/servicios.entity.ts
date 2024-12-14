
import { Categoria } from '../../categorias/entities/categoria.entity';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Servicio {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Int)
  precio: number;

  @Field(() => Int)
  duracion: number; 

  @Field(() => Categoria)
  categoria: Categoria;
}
