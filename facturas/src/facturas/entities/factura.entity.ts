import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Cita } from './cita.entity';

@Entity({ name: 'facturas' })
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cita, { onDelete: 'CASCADE' })
  cita: Cita;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  montoTotal: number;

  @Column({ type: 'enum', enum: ['efectivo', 'tarjeta', 'transferencia'], nullable: false })
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

  @CreateDateColumn({ name: 'fecha_pago', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaPago: Date;
}