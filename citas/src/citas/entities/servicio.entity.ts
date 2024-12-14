import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { Categoria } from './categoria.entity';
  
  @Entity({ name: 'servicios' })
  export class Servicio {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    nombre: string;
  
    @Column({ type: 'text', nullable: true })
    descripcion?: string;
  
    @Column()
    precio: number;
  
    @Column({ type: 'int', nullable: false })
    duracion: number; 
  
    @ManyToOne(() => Categoria, { onDelete: 'CASCADE' })
    categoria: Categoria;
  
  }
  