import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { ServiciosResolver } from './servicios.resolver';
import { ServicioGateway } from './servicios.gateway';

@Module({
  providers: [ServiciosResolver, ServicioGateway],
  controllers: [],
  imports: [NatsModule],
})
export class ServiciosModule {}
