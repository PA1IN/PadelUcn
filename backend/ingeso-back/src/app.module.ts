import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanchasModule } from './modulos/canchas/canchas.module';
import { UserModule } from './modulos/user/user.module';
import { AuthModule } from './modulos/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Puedes cambiar esto según la base de datos que vayas a usar
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Cambia esto por tu usuario
      password: 'postgres', // Cambia esto por tu contraseña
      database: 'padelucn', // Cambia esto por el nombre de tu base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo, no usar en producción
    }),
    CanchasModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
