import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { HistorialReserva } from './historial-reserva.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';

@Entity({ name: 'Reserva' })
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: Date;

  @Column({ name: 'hora_termino', type: 'time' })
  horaTermino: Date;

  @Column({ name: 'id_cancha' })
  canchaId: number;

  @Column({ name: 'id_usuario' })
  usuarioId: number;

  @ManyToOne(() => Cancha, cancha => cancha.reservas)
  @JoinColumn({ name: 'id_cancha' })
  cancha: Cancha;

  @ManyToOne(() => User, usuario => usuario.reservas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @OneToMany(() => HistorialReserva, historial => historial.reserva)
  historialReservas: HistorialReserva[];

  @OneToMany(() => BoletaEquipamiento, boleta => boleta.reserva)
  boletasEquipamiento: BoletaEquipamiento[];
}
