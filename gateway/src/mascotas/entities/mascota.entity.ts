import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Cliente } from '../../clientes/entities/cliente.entity';

@ObjectType()
export class Mascota {
  @Field(() => Int)
  id: number;

  @Field(() => Cliente) 
  cliente: Cliente;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  raza?: string;

  @Field(() => Int, { nullable: true })
  edad?: number;

  @Field(() => Float, { nullable: true })
  peso?: number;
}
