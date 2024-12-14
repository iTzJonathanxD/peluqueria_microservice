import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMascotaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsString()
    @IsOptional()
    raza?: string;
  
    @IsNumber()
    @IsOptional()
    edad?: number;
  
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    peso?: number;
  
    @IsNumber()
    @IsNotEmpty()
    clienteId: number; 
  }
  