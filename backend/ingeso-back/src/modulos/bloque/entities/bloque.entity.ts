import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bloque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hora_inicio: string;

  @Column()
  hora_termino: string;
  
  @Column({ default: true })
  activo: boolean;

  @Column({ default: 'Lunes a Viernes' })
  dias: string;
}
