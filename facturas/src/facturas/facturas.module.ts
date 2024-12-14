import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Cliente } from './entities/cliente.entity';
import { Categoria } from './entities/categoria.entity';
import { Mascota } from './entities/mascota.entity';
import { Servicio } from './entities/servicio.entity';
import { Factura } from './entities/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita,Cliente,Categoria,Mascota,Servicio,Factura])],
  controllers: [FacturasController],
  providers: [FacturasService],
})
export class FacturasModule {}
