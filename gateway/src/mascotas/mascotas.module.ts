import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { MascotasResolver } from './mascotas.resolver';
import { MascotaGateway } from './mascotas.gateway';

@Module({
  providers: [MascotasResolver, MascotaGateway],
  controllers: [],
  imports: [NatsModule],
})
export class MascotasModule {}
