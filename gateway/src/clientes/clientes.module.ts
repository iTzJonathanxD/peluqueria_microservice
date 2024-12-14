import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { ClientesResolver } from './clientes.resolver';
import { ClienteGateway } from './clientes.gateway';

@Module({
  providers: [ClientesResolver, ClienteGateway],
  controllers: [],
  imports: [NatsModule],
})
export class ClientesModule {}
