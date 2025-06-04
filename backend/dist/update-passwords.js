"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./modulos/usuario/entities/usuario.entity");
const bcrypt = require("bcrypt");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const userRepository = app.get((0, typeorm_1.getRepositoryToken)(usuario_entity_1.Usuario));
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(`Generated hash for '${plainPassword}': ${hashedPassword}`);
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
//# sourceMappingURL=update-passwords.js.map