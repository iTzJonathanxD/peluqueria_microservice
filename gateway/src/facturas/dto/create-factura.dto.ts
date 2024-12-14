import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

@InputType()
export class CreateFacturaDto {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  citaId: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  montoTotal: number;

  @Field()
  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  @IsNotEmpty()
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  fechaPago?: string; 
}
