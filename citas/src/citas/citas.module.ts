import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Cliente } from './entities/cliente.entity';
import { Categoria } from './entities/categoria.entity';
import { Mascota } from './entities/mascota.entity';
import { Servicio } from './entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita,Cliente,Categoria,Mascota,Servicio])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
