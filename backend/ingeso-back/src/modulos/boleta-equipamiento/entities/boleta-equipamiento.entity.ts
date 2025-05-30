import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';

@Entity({ name: 'BoletaEquipamiento' })
export class BoletaEquipamiento {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id: number;

  @Column()
  cantidad: number;

  @Column({ name: 'monto_total' })
  montoTotal: number;

  @Column({ name: 'id_reserva' })
  reservaId: number;

  @Column({ name: 'id_equipamiento' })
  equipamientoId: number;

  @ManyToOne(() => Reserva, reserva => reserva.boletasEquipamiento)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @ManyToOne(() => Equipamiento, equipamiento => equipamiento.boletas)
  @JoinColumn({ name: 'id_equipamiento' })
  equipamiento: Equipamiento;
}
