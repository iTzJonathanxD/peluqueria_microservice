import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCitaDto } from './create-citas.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;
}
