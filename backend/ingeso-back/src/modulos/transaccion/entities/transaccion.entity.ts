import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity'; // ✅ RUTA CORRECTA

@Entity('transaccion')
export class Transaccion {
  @PrimaryGeneratedColumn()
  id_transaccion: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'id_boleta_equipamiento', nullable: true })
  idBoletaEquipamiento: number | null;

  // Relación con boleta_equipamiento
  @ManyToOne(() => BoletaEquipamiento, { nullable: true })
  @JoinColumn({ name: 'id_boleta_equipamiento' })
  boletaEquipamiento: BoletaEquipamiento | null;
}
