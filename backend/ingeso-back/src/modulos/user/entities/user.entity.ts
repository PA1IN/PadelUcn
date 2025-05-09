import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';

@Entity()
export class User {
  @PrimaryColumn()
  rut: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  correo: string;

  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas: Reserva[];

  @OneToMany(() => BoletaEquipamiento, boleta => boleta.usuario)
  boletas: BoletaEquipamiento[];
}
