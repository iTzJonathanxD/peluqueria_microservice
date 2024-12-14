import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Cliente {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field()
  telefono: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  direccion?: string;
}
