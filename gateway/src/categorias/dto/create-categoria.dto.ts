import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCategoriaDto {
  @Field() 
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field({ nullable: true }) 
  @IsString() 
  @IsOptional() 
  descripcion?: string;
}
