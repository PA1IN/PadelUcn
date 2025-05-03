import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';

@Entity()
export class BoletaEquipamiento {
  @PrimaryGeneratedColumn()
  id_boleta: number;

  @ManyToOne(() => User, usuario => usuario.boletas)
  @JoinColumn({ name: 'rut_usuario' })
  usuario: User;

  @ManyToOne(() => Reserva, reserva => reserva.boletas)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @ManyToOne(() => Equipamiento, equipamiento => equipamiento.boletas)
  @JoinColumn({ name: 'id_equipamiento' })
  equipamiento: Equipamiento;

  @Column()
  cantidad: number;
}
