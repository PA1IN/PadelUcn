import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bloque')
export class Bloque {
  @PrimaryGeneratedColumn()
  id_bloque: number;

  @Column({ type: 'date', nullable: true })
  fecha_date: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;
  
  @Column({ default: true })
  activo: boolean;

  @Column({ default: 'Lunes a Viernes' })
  dias: string;
}
