import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Reserva } from './reserva.entity';

@Entity({ name: 'historial_reserva' })
export class HistorialReserva {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id: number;

  @Column({
    name: 'estado',
    type: 'varchar',
    nullable: false
  })
  estado: string;

  @Column({ name: 'fecha_estado', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaEstado: Date;

  @ManyToOne(() => Reserva, reserva => reserva.historial)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @Column({ name: 'id_reserva' })
  idReserva: number;

  @ManyToOne(() => User, usuario => usuario.historialReservas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({ name: 'id_usuario' })
  idUsuario: number;
}
