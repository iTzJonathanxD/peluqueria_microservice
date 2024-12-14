import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateClienteDto } from './create-cliente.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;
}
