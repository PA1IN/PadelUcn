import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';

@Entity({ name: 'Equipamiento' })
export class Equipamiento {
  @PrimaryGeneratedColumn({ name: 'id_equipamiento' })
  id: number;

  @Column()
  tipo: string;

  @Column()
  nombre: string;

  @Column()
  stock: number;

  @Column()
  costo: number;

  @OneToMany(() => BoletaEquipamiento, boleta => boleta.equipamiento)
  boletas: BoletaEquipamiento[];
}
