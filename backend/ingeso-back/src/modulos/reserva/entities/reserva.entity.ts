import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { HistorialReserva } from './historial-reserva.entity';

@Entity({ name: 'reserva' })
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_termino: string;

  @ManyToOne(() => User, usuario => usuario.reservas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @ManyToOne(() => Cancha, cancha => cancha.reservas)
  @JoinColumn({ name: 'id_cancha' })
  cancha: Cancha;

  @OneToMany(() => HistorialReserva, historial => historial.reserva)
  historial: HistorialReserva[];

  @OneToMany(() => BoletaEquipamiento, boleta => boleta.reserva)
  boletas: BoletaEquipamiento[];
}
