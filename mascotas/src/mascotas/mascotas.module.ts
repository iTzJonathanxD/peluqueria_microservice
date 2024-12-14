import { Module } from '@nestjs/common';
import { MascotasService } from './mascotas.service';
import { MascotasController } from './mascotas.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Mascota } from './entities/mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente,Mascota])],
  controllers: [MascotasController],
  providers: [MascotasService],
})
export class MascotasModule {}
