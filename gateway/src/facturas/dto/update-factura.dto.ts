import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateFacturaDto } from './create-factura.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {
  @Field(() => Int) 
  @IsNotEmpty()
  id: number;

}
