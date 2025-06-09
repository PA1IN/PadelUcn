import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './modulos/usuario/entities/usuario.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const userRepository = app.get(getRepositoryToken(Usuario));
  
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  console.log(`Generated hash for '${plainPassword}': ${hashedPassword}`);
  
  // Update the users with the new password hash
  const users = await userRepository.find({
    where: [
      { rut: '11111111-1' },
      { rut: '22222222-2' },
      { rut: '33333333-3' }
    ]
  });
  
  console.log(`Found ${users.length} users to update`);
  
  for (const user of users) {
    user.password = hashedPassword;
    await userRepository.save(user);
    console.log(`Updated password for user ${user.rut}`);
  }
  
  // Verify the updates
  const updatedUsers = await userRepository.find({
    where: [
      { rut: '11111111-1' },
      { rut: '22222222-2' },
      { rut: '33333333-3' }
    ]
  });
  
  console.log('Updated users:');
  updatedUsers.forEach(user => console.log(`${user.rut}: ${user.password}`));
  
  await app.close();
}

bootstrap();
