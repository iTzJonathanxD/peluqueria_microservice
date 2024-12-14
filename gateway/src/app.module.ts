import { Module } from '@nestjs/common';
import { NatsModule } from './transports/nats.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CategoriasController } from './categorias/categorias.controller';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join} from 'path';
import { AuthModule } from './auth/auth.module';
import { PdfController } from './pdf/pdf.service';
import { FacturasModule } from './facturas/facturas.module';
import { FacturasController } from './facturas/facturas.controller';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesController } from './clientes/clientes.controller';
import { CitasModule } from './citas/citas.module';
import { CitasController } from './citas/citas.controller';
import { MascotasModule } from './mascotas/mascotas.module';
import { MascotasController } from './mascotas/mascotas.controller';
import { ServiciosController } from './servicios/servicios.controller';
import { ServiciosModule } from './servicios/servicios.module';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: false,
    autoSchemaFile: join(process.cwd(), 'src/schems/schema.gql'),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  }),
  NatsModule, CategoriasModule, AuthModule,FacturasModule,ClientesModule,CitasModule,MascotasModule,ServiciosModule],
  controllers: [CategoriasController,PdfController,FacturasController,ClientesController,CitasController,MascotasController,ServiciosController],
  providers: [],
})
export class AppModule {}
