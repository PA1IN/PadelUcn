import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity('jugador')
export class Jugador {
  @PrimaryGeneratedColumn({ name: 'id_jugador' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  rut: string;

  @Column()
  edad: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.jugadores)
  @JoinColumn({ name: 'id_reserva' }) 
  reserva: Reserva;
  
}
