import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Cancha } from '../../cancha/entities/cancha.entity';
import { HistorialReserva } from '../../historial-reserva/entities/historial-reserva.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Jugador } from '../../jugador/entities/jugador.entity';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_termino: string;
  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @Column()
  idUsuario: number;

  @ManyToOne(() => Cancha, (cancha) => cancha.reservas)
  @JoinColumn({ name: 'idCancha' })
  cancha: Cancha;

  @Column()
  idCancha: number;

  @OneToMany(() => HistorialReserva, (historial) => historial.reserva)
  historiales: HistorialReserva[];

  @OneToMany(() => BoletaEquipamiento, (boleta) => boleta.reserva)
  boletas: BoletaEquipamiento[];

  @OneToMany(() => Jugador, (jugador) => jugador.reserva)
  jugadores: Jugador[];
}
