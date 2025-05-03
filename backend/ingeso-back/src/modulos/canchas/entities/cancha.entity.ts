import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity()
export class Cancha {
  @PrimaryColumn()
  numero: number;

  @Column()
  costo: number;

  @OneToMany(() => Reserva, reserva => reserva.cancha)
  reservas: Reserva[];
}
