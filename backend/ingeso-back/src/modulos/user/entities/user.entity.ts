import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { HistorialReserva } from '../../reserva/entities/historial-reserva.entity';

@Entity({ name: 'usuario' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;
  
  @Column({ unique: true })
  rut: string;

  @Column({ name: 'contraseña' })
  password: string;

  @Column({ name: 'nombre_usuario' })
  nombre: string;

  @Column()
  correo: string;
  
  @Column({ nullable: true })
  telefono: string;
  
  @Column({ default: 0 })
  saldo: number;
  
  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas: Reserva[];
  @OneToMany(() => HistorialReserva, historial => historial.usuario)
  historialReservas: HistorialReserva[];
}
