import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Cancha {
  @PrimaryColumn()
  numero: number;

  @Column()
  costo: number;
}
