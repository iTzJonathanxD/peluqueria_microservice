import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsNumber } from 'class-validator';

export class CreateServicioDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsString()
    @IsOptional()
    descripcion?: string;
  
    @IsNotEmpty()
    precio: number;
  
    @IsNumber()
    @IsNotEmpty()
    duracion: number;
  
    @IsNumber()
    @IsNotEmpty()
    categoriaId: number; 
  }