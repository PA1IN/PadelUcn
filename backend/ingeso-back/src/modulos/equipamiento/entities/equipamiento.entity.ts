import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipamiento')
export class Equipamiento {
  @PrimaryGeneratedColumn({ name: 'id_equipamiento' })
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
