import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { CategoriasResolver } from './categorias.resolver';
import { CategoriaGateway } from './categorias.gateway';

@Module({
  providers: [CategoriasResolver, CategoriaGateway],
  controllers: [],
  imports: [NatsModule],
})
export class CategoriasModule {}
