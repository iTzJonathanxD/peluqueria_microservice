import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion?: string;

}

