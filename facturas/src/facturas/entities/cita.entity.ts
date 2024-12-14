import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Mascota } from './mascota.entity';
import { Servicio } from './servicio.entity';

@Entity({ name: 'citas' })
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { onDelete: 'CASCADE' })
  cliente: Cliente;

  @ManyToOne(() => Mascota, { onDelete: 'CASCADE' })
  mascota: Mascota;

  @ManyToOne(() => Servicio, { onDelete: 'CASCADE' })
  servicio: Servicio;

  @Column({ nullable: false })
  fechaCita: Date;

  @Column({ type: 'enum', enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente' })
  estado: 'pendiente' | 'confirmada' | 'cancelada';


}