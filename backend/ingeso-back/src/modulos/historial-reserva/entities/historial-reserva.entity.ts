import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class HistorialReserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estado: string; // Pendiente, Modificado, Cancelado, Completado

  @Column()
  fechaEstado: Date;

  @ManyToOne(() => Reserva, (reserva) => reserva.historiales)
  @JoinColumn({ name: 'idReserva' })
  reserva: Reserva;

  @Column()
  idReserva: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.historiales)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @Column()
  idUsuario: number;
}
