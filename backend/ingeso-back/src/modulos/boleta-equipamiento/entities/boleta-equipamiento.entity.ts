import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';

@Entity()
export class BoletaEquipamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @Column()
  montoTotal: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.boletas)
  @JoinColumn({ name: 'idReserva' })
  reserva: Reserva;

  @Column()
  idReserva: number;

  @ManyToOne(() => Equipamiento)
  @JoinColumn({ name: 'idEquipamiento' })
  equipamiento: Equipamiento;

  @Column()
  idEquipamiento: number;
}
