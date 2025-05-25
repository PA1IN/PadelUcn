import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';

@Entity({ name: 'boleta_equipamiento' })
export class BoletaEquipamiento {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id: number;
  @Column({ nullable: false })
  cantidad: number;
  
  @Column({ name: 'monto_total', nullable: false })
  montoTotal: number;

  @ManyToOne(() => Reserva, reserva => reserva.boletas)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;
  
  @Column({ name: 'id_reserva', nullable: false })
  idReserva: number;

  @ManyToOne(() => Equipamiento, equipamiento => equipamiento.boletas)
  @JoinColumn({ name: 'id_equipamiento' })
  equipamiento: Equipamiento;
  
  @Column({ name: 'id_equipamiento', nullable: false })
  idEquipamiento: number;
}
