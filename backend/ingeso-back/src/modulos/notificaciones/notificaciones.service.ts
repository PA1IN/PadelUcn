import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { UpdateNotificacioneDto } from './dto/update-notificacione.dto';
import { Notificacion } from './entities/notificacione.entity';
import { CreateResponse } from '../../common/helpers/create-response.helper';

@Injectable()
export class NotificacionesService implements OnModuleInit {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) {}

  // crea la tabla
  async onModuleInit() {
    try {
      await this.notificacionRepository.query(`
        CREATE TABLE IF NOT EXISTS notificacion(
          id_notificacion SERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          mensaje TEXT NOT NULL,
          tipo_evento VARCHAR(50) NOT NULL,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          leida BOOLEAN DEFAULT FALSE,
          id_usuario INT NOT NULL,
          id_reserva INT,
          FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
          FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva)
        );
      `);
      console.log('Tabla notificacion verificada/creada');
    } catch (error) {
      console.log('Tabla notificacion ya existía o error menor');
    }
  }

  // crea la notifiacion
  async create(createNotificacioneDto: CreateNotificacioneDto) {
    const notificacion = this.notificacionRepository.create(createNotificacioneDto);
    const saved = await this.notificacionRepository.save(notificacion);
    
    return CreateResponse(
      'Notificación creada exitosamente',
      saved,
      'CREATED'
    );
  }

  //historial de notificaciones
  async getHistorialUsuario(idUsuario: number) {
    const notificaciones = await this.notificacionRepository.find({
      where: { idUsuario },
      relations: ['reserva', 'reserva.cancha'],
      order: { fechaCreacion: 'DESC' }
    });

    return CreateResponse(
      `${notificaciones.length} notificaciones encontradas`,
      notificaciones,
      'SUCCESS'
    );
  }

  // notificaciones leidas
  async getNotificacionesNoLeidas(idUsuario: number) {
    const noLeidas = await this.notificacionRepository.find({
      where: { idUsuario, leida: false },
      relations: ['reserva', 'reserva.cancha'],
      order: { fechaCreacion: 'DESC' }
    });

    return CreateResponse(
      `${noLeidas.length} notificaciones no leídas`,
      noLeidas,
      'SUCCESS'
    );
  }

  //marca una notificacion como leida
  async marcarComoLeida(id: number) {
    await this.notificacionRepository.update(id, { leida: true });
    
    return CreateResponse(
      'Notificación marcada como leída',
      { id, leida: true },
      'SUCCESS'
    );
  }

  // marca todas como leidas
  async marcarTodasComoLeidas(idUsuario: number) {
    const result = await this.notificacionRepository.update(
      { idUsuario, leida: false },
      { leida: true }
    );

    return CreateResponse(
      `${result.affected} notificaciones marcadas como leídas`,
      { actualizadas: result.affected },
      'SUCCESS'
    );
  }

  // elimina la notificacion del historial
async eliminarNotificacion(id: number) {
  const result = await this.notificacionRepository.delete(id);
  
  return CreateResponse(
    'Notificación eliminada del historial',
    { eliminada: (result.affected || 0) > 0 },
    'SUCCESS'
  );
}

  // estadisticas (en desarollo)
  async getEstadisticasUsuario(idUsuario: number) {
    const total = await this.notificacionRepository.count({ where: { idUsuario } });
    const noLeidas = await this.notificacionRepository.count({ 
      where: { idUsuario, leida: false } 
    });
    const leidas = total - noLeidas;

    const porTipo = await this.notificacionRepository
      .createQueryBuilder('n')
      .select('n.tipoEvento', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('n.idUsuario = :idUsuario', { idUsuario })
      .groupBy('n.tipoEvento')
      .getRawMany();

    return CreateResponse(
      'Estadísticas de notificaciones',
      {
        total,
        noLeidas,
        leidas,
        porTipo
      },
      'SUCCESS'
    );
  }

  // metodos para mantener la estructura del servicio
  findAll() {
    return `This action returns all notificaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificacione`;
  }

  update(id: number, updateNotificacioneDto: UpdateNotificacioneDto) {
    return `This action updates a #${id} notificacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificacione`;
  }
}
