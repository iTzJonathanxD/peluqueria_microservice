import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateClienteDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  telefono?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  direccion?: string;
}