import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Categoria {
  @Field(() => Int)
  id: number;
  
  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;
  
}

