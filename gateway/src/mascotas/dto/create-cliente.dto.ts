import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber } from 'class-validator';

@InputType()
export class CreateMascotaDto {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  raza?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  edad?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  peso?: number;
}
