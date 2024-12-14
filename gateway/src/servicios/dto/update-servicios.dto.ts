import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateServicioDto } from './create-servicios.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateServicioDto extends PartialType(CreateServicioDto) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
