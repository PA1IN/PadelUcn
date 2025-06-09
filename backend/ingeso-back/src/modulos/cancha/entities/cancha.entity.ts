import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity('cancha')
export class Cancha {
  @PrimaryGeneratedColumn({ name: 'id_cancha' })
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  valor: number;
  @Column({ default: false })
  mantenimiento: boolean;

  @Column({ name: 'cantidad_max_jugador', default: 4 })
  cantidadMaxJugador: number;

  @OneToMany(() => Reserva, (reserva) => reserva.cancha)
  reservas: Reserva[];
}
