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
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const newUser = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
            });
            const savedUser = await this.userRepository.save(newUser);
            const { password, ...result } = savedUser;
            return (0, api_response_util_1.CreateResponse)('Usuario creado exitosamente', result, 'CREATED');
        }
        catch (error) {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map