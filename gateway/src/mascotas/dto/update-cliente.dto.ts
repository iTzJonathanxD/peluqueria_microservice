import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';
import { CreateMascotaDto } from './create-cliente.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateMascotaDto extends PartialType(CreateMascotaDto) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
