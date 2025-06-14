import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('historial_reserva') 
export class HistorialReserva {
  @PrimaryGeneratedColumn({ name: 'id_historial' }) 
  id: number;

  @Column()
  estado: string;

  @Column({ name: 'fecha_estado' })  
  fechaEstado: Date;

  @ManyToOne(() => Reserva, (reserva) => reserva.historiales)
  @JoinColumn({ name: 'id_reserva' }) 
  reserva: Reserva;

  @ManyToOne(() => Usuario, (usuario) => usuario.historiales)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
