import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity({ name: 'cancha' })
export class Cancha {
  @PrimaryGeneratedColumn({ name: 'id_cancha' })
  id: number;
  
  // Duplicamos la propiedad para que TypeORM pueda acceder a ella directamente
  // Esta propiedad será mapeada a la misma columna que 'id'
  /*@PrimaryGeneratedColumn({ name: 'id_cancha' })
  id_cancha: number;*/
  
  @Column({ unique: true })
  numero: number;
  
  @Column()
  nombre: string;
  
  @Column({ nullable: true })
  descripcion: string;
  
  @Column({ default: false })
  mantenimiento: boolean;
  
  @Column({ type: 'int', nullable:false})
  valor: number;

  @OneToMany(() => Reserva, reserva => reserva.cancha)
  reservas: Reserva[];
}
