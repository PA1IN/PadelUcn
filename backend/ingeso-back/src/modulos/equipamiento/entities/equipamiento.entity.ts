import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';

@Entity()
export class Equipamiento {
  @PrimaryGeneratedColumn()
  id_equipamiento: number;

  @Column()
  tipo: string;

  @Column()
  costo: number;

  @Column()
  stock: number;

  @OneToMany(() => BoletaEquipamiento, boletaEquipamiento => boletaEquipamiento.equipamiento)
  boletas: BoletaEquipamiento[];
}
