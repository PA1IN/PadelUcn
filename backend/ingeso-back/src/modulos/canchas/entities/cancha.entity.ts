import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity({ name: 'cancha' })
export class Cancha {
  @PrimaryGeneratedColumn({ name: 'id_cancha' })
  id: number;
  
  // Alias para evitar errores de acceso a id_cancha
  get id_cancha(): number {
    return this.id;
  }
  
  @Column({ unique: true })
  numero: number;
  
  @Column()
  nombre: string;
  
  @Column({ nullable: true })
  descripcion: string;
  
  @Column({ default: false })
  mantenimiento: boolean;
  
  @Column()
  valor: number;

  @OneToMany(() => Reserva, reserva => reserva.cancha)
  reservas: Reserva[];
}
