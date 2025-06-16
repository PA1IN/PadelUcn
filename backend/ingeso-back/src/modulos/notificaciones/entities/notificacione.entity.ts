import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';  

@Entity('notificacion')
export class Notificacion {
  @PrimaryGeneratedColumn({ name: 'id_notificacion' })
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  mensaje: string;

  @Column({ name: 'tipo_evento' })
  tipoEvento: 'RESERVA_CREADA' | 'RESERVA_PAGADA' | 'RESERVA_MODIFICADA' | 'RESERVA_ELIMINADA';

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ default: false })
  leida: boolean;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @ManyToOne(() => Reserva, { nullable: true })
  @JoinColumn({ name: 'id_reserva' })
  reserva?: Reserva;

  @Column({ name: 'id_reserva', nullable: true })
  idReserva?: number;
}