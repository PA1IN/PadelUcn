import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity({ name: 'Cancha' })
export class Cancha {
  @PrimaryGeneratedColumn({ name: 'id_cancha' })
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: false })
  mantenimiento: boolean;

  @Column()
  valor: number;

  @OneToMany(() => Reserva, reserva => reserva.cancha)
  reservas: Reserva[];
}
