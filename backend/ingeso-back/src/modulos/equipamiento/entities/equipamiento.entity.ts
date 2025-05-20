import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';

@Entity({ name: 'equipamiento' })
export class Equipamiento {
  @PrimaryGeneratedColumn({ name: 'id_equipamiento' })
  id: number;
  @Column({ nullable: false })
  tipo: string;

  @Column({ nullable: false })
  costo: number;

  @Column({ nullable: false })
  stock: number;
  
  @Column({ nullable: false })
  nombre: string;

  @OneToMany(() => BoletaEquipamiento, boletaEquipamiento => boletaEquipamiento.equipamiento)
  boletas: BoletaEquipamiento[];
}
