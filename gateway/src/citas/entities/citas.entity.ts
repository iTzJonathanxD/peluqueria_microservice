import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Mascota } from '../../mascotas/entities/mascota.entity';
import { Servicio } from '../../servicios/entities/servicios.entity';

@ObjectType()
export class Cita {
  @Field(() => Int)
  id: number;

  @Field(() => Cliente)
  cliente: Cliente;

  @Field(() => Mascota)
  mascota: Mascota;

  @Field(() => Servicio)
  servicio: Servicio;

  @Field()
  fechaCita: Date;

  @Field()
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}
