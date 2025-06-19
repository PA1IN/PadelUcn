import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanchaModule } from './modulos/cancha/cancha.module';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { AuthModule } from './modulos/auth/auth.module';
import { ReservaModule } from './modulos/reserva/reserva.module';
import { EquipamientoModule } from './modulos/equipamiento/equipamiento.module';
import { BloqueModule } from './modulos/bloque/bloque.module';
import { JugadorModule } from './modulos/jugador/jugador.module';
import { BoletaEquipamientoModule } from './modulos/boleta-equipamiento/boleta-equipamiento.module';
import { NotificacionesModule } from './modulos/notificaciones/notificaciones.module';
import { TransaccionModule } from './modulos/transaccion/transaccion.module';


@Module({  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5433')),
        username: configService.get('DB_USER', 'ingeso'),
        password: configService.get('DB_PASSWORD', '12342'),        database: configService.get('DB_NAME', 'padelucn'),        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // para el esquema SQL uu
        logging: true,
        retryAttempts: 5,
        retryDelay: 3000,
        connectTimeoutMS: 10000,
      }),    }),    CanchaModule,    UsuarioModule,    AuthModule,    ReservaModule,
    EquipamientoModule,
    BloqueModule,
    JugadorModule,
    NotificacionesModule,
    BoletaEquipamientoModule,
    TransaccionModule,
    ReservaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
