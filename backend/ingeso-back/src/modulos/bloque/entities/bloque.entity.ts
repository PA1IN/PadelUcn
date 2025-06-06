import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'bloque' })
export class Bloque {
  @PrimaryGeneratedColumn({ name: 'id_bloque' })
  id: number;

  @Column({ default: true})
  activo: boolean;

  @Column({type: 'time'})
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column({ default: 'Lunes a Viernes' })
  dias: string;
}
