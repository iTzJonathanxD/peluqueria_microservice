import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Factura {
  @Field(() => Int)
  id: number;

  @Field()
  montoTotal: number;

  @Field()
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

  @Field()
  fechaPago: Date;
}