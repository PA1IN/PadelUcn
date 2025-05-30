"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./entities/user.entity");
const api_response_util_1 = require("../../utils/api-response.util");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        try {
            const existingUser = await this.userRepository.findOne({ where: { rut: createUserDto.rut } });
            if (existingUser) {
                throw new Error(`Ya existe un usuario con el RUT ${createUserDto.rut}`);
            }
            console.log('Creating user with data:', { ...createUserDto, password: '[HIDDEN]' });
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            console.log('Password hashed successfully');
            const newUser = this.userRepository.create({
                rut: createUserDto.rut,
                password: hashedPassword,
                nombre: createUserDto.nombre,
                correo: createUserDto.correo,
                telefono: createUserDto.telefono,
                saldo: createUserDto.saldo || 0,
                isAdmin: createUserDto.isAdmin || false,
            });
            console.log('User entity created:', { ...newUser, password: '[HIDDEN]' });
            try {
                const savedUser = await this.userRepository.save(newUser);
                console.log('User saved successfully:', { ...savedUser, password: '[HIDDEN]' });
                const { password, ...result } = savedUser;
                return (0, api_response_util_1.CreateResponse)('Usuario creado exitosamente', result, 'CREATED');
            }
            catch (saveError) {
                console.error('Error saving user to database:', saveError);
                console.error('Stack trace:', saveError.stack);
                throw saveError;
            }
        }
        catch (error) {
            console.error('Error al crear usuario:', error);
            console.error('Stack trace:', error.stack);
            if (error.name === 'QueryFailedError') {
                console.error('SQL Error:', error.detail || error.message);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear usuario', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const users = await this.userRepository.find();
            const usersWithoutPasswords = users.map(user => {
                const { password, ...result } = user;
                return result;
            });
            return (0, api_response_util_1.CreateResponse)('Usuarios obtenidos exitosamente', usersWithoutPasswords, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener usuarios', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(rut) {
        try {
            const user = await this.userRepository.findOne({ where: { rut } });
            if (!user) {
                throw new Error(`No se encontró un usuario con el RUT ${rut}`);
            }
            const { password, ...result } = user;
            return (0, api_response_util_1.CreateResponse)('Usuario obtenido exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener usuario', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByRut(rut) {
        return await this.userRepository.findOne({ where: { rut } });
    }
    async findById(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error(`No se encontró un usuario con el ID ${id}`);
            }
            const { password, ...result } = user;
            return (0, api_response_util_1.CreateResponse)('Usuario obtenido exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener usuario', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSaldo(userId, monto) {
        try {
            const userResponse = await this.findById(userId);
            if (!userResponse.data) {
                throw new Error(`Usuario con ID ${userId} no encontrado`);
            }
            const user = userResponse.data;
            const nuevoSaldo = user.saldo + monto;
            if (nuevoSaldo < 0) {
                throw new Error('El saldo no puede ser negativo');
            }
            await this.userRepository.update(userId, { saldo: nuevoSaldo });
            const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
            if (!updatedUser) {
                throw new Error(`Error al obtener usuario actualizado con ID ${userId}`);
            }
            const { password, ...result } = updatedUser;
            return (0, api_response_util_1.CreateResponse)('Saldo actualizado exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('no encontrado')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            else if (error.message.includes('no puede ser negativo')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error de saldo', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar saldo', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(rut, updateUserDto) {
        try {
            const user = await this.userRepository.findOne({ where: { rut } });
            if (!user) {
                throw new Error(`No se encontró un usuario con el RUT ${rut}`);
            }
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }
            await this.userRepository.update(rut, updateUserDto);
            const updatedUser = await this.userRepository.findOne({ where: { rut } });
            if (!updatedUser) {
                throw new Error(`Error al obtener usuario actualizado con RUT ${rut}`);
            }
            const { password, ...result } = updatedUser;
            return (0, api_response_util_1.CreateResponse)('Usuario actualizado exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar usuario', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(rut) {
        try {
            const user = await this.userRepository.findOne({ where: { rut } });
            if (!user) {
                throw new Error(`No se encontró un usuario con el RUT ${rut}`);
            }
            await this.userRepository.delete(rut);
            return (0, api_response_util_1.CreateResponse)('Usuario eliminado exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar usuario', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async promoteToAdmin(rut) {
        try {
            const user = await this.userRepository.findOne({ where: { rut } });
            if (!user) {
                throw new Error(`No se encontró un usuario con el RUT ${rut}`);
            }
            if (user.isAdmin) {
                return (0, api_response_util_1.CreateResponse)('El usuario ya es administrador', { rut: user.rut, isAdmin: true }, 'OK');
            }
            await this.userRepository.update(rut, { isAdmin: true });
            const updatedUser = await this.userRepository.findOne({ where: { rut } });
            if (!updatedUser) {
                throw new Error(`Error al obtener usuario actualizado con RUT ${rut}`);
            }
            const { password, ...result } = updatedUser;
            return (0, api_response_util_1.CreateResponse)('Usuario promovido a administrador exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al promover usuario a administrador', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map