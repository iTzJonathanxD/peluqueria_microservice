import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  @Field(() => Int) 
  @IsNotEmpty()
  id: number;

}
