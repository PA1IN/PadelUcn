import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equipamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  nombre: string;

  @Column()
  stock: number;

  @Column()
  costo: number;
}
