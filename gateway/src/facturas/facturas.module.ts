import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { FacturasResolver } from './facturas.resolver';
import { FacturaGateway } from './facturas.gateway';

@Module({
  providers: [FacturasResolver, FacturaGateway],
  controllers: [],
  imports: [NatsModule],
})
export class FacturasModule {}
