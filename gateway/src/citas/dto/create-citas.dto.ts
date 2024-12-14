import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

@InputType()
export class CreateCitaDto {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  mascotaId: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  servicioId: number;

  @Field()
  @IsNotEmpty()
  fechaCita: Date;

  @Field({ nullable: true })
  @IsEnum(['pendiente', 'confirmada', 'cancelada'])
  @IsOptional()
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}
