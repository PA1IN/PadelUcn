import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';

@Entity('boleta_equipamiento')
export class BoletaEquipamiento {
  @PrimaryGeneratedColumn({ name: 'id_boleta' })
  id: number;

  @Column()
  cantidad: number;

  @Column({ name: 'monto_total' })
  montoTotal: number;
  

  @ManyToOne(() => Reserva, (reserva) => reserva.boletas)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @Column({ name: 'id_reserva' })
  idReserva: number;

  @ManyToOne(() => Equipamiento)
  @JoinColumn({ name: 'id_equipamiento' })
  equipamiento: Equipamiento;
  

  @Column({ name: 'id_equipamiento' })
  idEquipamiento: number;
}
