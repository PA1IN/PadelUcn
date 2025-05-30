import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Reserva } from './reserva.entity';

@Entity({ name: 'HistorialReserva' })
export class HistorialReserva {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id: number;

  @Column()
  estado: string;

  @Column({ name: 'fecha_estado', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEstado: Date;

  @Column({ name: 'id_reserva' })
  reservaId: number;

  @Column({ name: 'id_usuario' })
  usuarioId: number;

  @ManyToOne(() => Reserva, reserva => reserva.historialReservas)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @ManyToOne(() => User, usuario => usuario.historialReservas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;
}
