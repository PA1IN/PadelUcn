import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id_reserva: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_termino: string;

  @ManyToOne(() => User, usuario => usuario.reservas)
  @JoinColumn({ name: 'rut_usuario' })
  usuario: User;

  @ManyToOne(() => Admin, admin => admin.reservas, { nullable: true })
  @JoinColumn({ name: 'id_admin' })
  administrador: Admin;

  @ManyToOne(() => Cancha, cancha => cancha.reservas)
  @JoinColumn({ name: 'numero_cancha' })
  cancha: Cancha;

  @OneToMany(() => BoletaEquipamiento, boleta => boleta.reserva)
  boletas: BoletaEquipamiento[];
}
