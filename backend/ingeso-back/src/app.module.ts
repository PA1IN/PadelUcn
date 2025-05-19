import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanchasModule } from './modulos/canchas/canchas.module';
import { UserModule } from './modulos/user/user.module';
import { AuthModule } from './modulos/auth/auth.module';
import { ReservaModule } from './modulos/reserva/reserva.module';
import { EquipamientoModule } from './modulos/equipamiento/equipamiento.module';
import { BoletaEquipamientoModule } from './modulos/boleta-equipamiento/boleta-equipamiento.module';

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
        synchronize: true, // Temporalmente activado para actualizar el esquema
        logging: true,
        retryAttempts: 5,
        retryDelay: 3000,
        connectTimeoutMS: 10000,
      }),    }),
    CanchasModule,
    UserModule,
    AuthModule,
    ReservaModule,
    EquipamientoModule,
    BoletaEquipamientoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
