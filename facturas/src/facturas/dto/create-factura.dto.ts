import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateFacturaDto {
    @IsNumber()
    @IsNotEmpty()
    citaId: number;

    @IsNumber()
    @IsNotEmpty()
    montoTotal: number;

    @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
    @IsNotEmpty()
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

    @IsDateString()
    @IsOptional()
    fechaPago?: string; 
}
