import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { CitasResolver } from './citas.resolver';
import { CitaGateway } from './citas.gateway';

@Module({
  providers: [CitasResolver, CitaGateway],
  controllers: [],
  imports: [NatsModule],
})
export class CitasModule {}
