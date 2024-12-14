import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ name: 'mascotas' })
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { onDelete: 'CASCADE' })
  cliente: Cliente;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  raza?: string;

  @Column({ type: 'int', nullable: true })
  edad?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso?: number;
  
}