import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id_admin: number;

  @Column()
  nombre_usuario: string;

  @Column()
  password: string;

  @OneToMany(() => Reserva, reserva => reserva.administrador)
  reservas: Reserva[];
}
