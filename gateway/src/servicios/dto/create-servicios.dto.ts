import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt, Min } from 'class-validator';

@InputType()
export class CreateServicioDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @Field()
  @IsNotEmpty()
  precio: number;

  @Field()
  @IsInt()
  @Min(1)
  duracion: number;

  @Field()
  @IsInt()
  @IsNotEmpty()
  categoriaId: number;
}
