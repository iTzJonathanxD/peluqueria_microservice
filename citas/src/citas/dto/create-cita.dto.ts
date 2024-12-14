import { IsNotEmpty, IsDateString, IsEnum, IsInt } from 'class-validator';

export class CreateCitaDto {
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @IsInt()
  @IsNotEmpty()
  mascotaId: number;

  @IsInt()
  @IsNotEmpty()
  servicioId: number;

  @IsDateString()
  @IsNotEmpty()
  fechaCita: string;

  @IsEnum(['pendiente', 'confirmada', 'cancelada'])
  @IsNotEmpty()
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}
