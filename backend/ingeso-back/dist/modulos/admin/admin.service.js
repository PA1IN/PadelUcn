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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const admin_entity_1 = require("./entities/admin.entity");
const api_response_util_1 = require("../../utils/api-response.util");
let AdminService = class AdminService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async create(createAdminDto) {
        try {
            const existingAdmin = await this.adminRepository.findOne({
                where: { nombre_usuario: createAdminDto.nombre_usuario }
            });
            if (existingAdmin) {
                throw new Error(`Ya existe un administrador con el nombre de usuario ${createAdminDto.nombre_usuario}`);
            }
            const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
            const newAdmin = this.adminRepository.create({
                ...createAdminDto,
                password: hashedPassword,
            });
            const savedAdmin = await this.adminRepository.save(newAdmin);
            const { password, ...result } = savedAdmin;
            return (0, api_response_util_1.CreateResponse)('Administrador creado exitosamente', result, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear administrador', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const admins = await this.adminRepository.find();
            const adminsWithoutPasswords = admins.map(admin => {
                const { password, ...result } = admin;
                return result;
            });
            return (0, api_response_util_1.CreateResponse)('Administradores obtenidos exitosamente', adminsWithoutPasswords, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener administradores', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const admin = await this.adminRepository.findOne({ where: { id_admin: id } });
            if (!admin) {
                throw new Error(`No se encontró un administrador con el ID ${id}`);
            }
            const { password, ...result } = admin;
            return (0, api_response_util_1.CreateResponse)('Administrador obtenido exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Administrador no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener administrador', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByUsername(username) {
        return await this.adminRepository.findOne({ where: { nombre_usuario: username } });
    }
    async update(id, updateAdminDto) {
        try {
            const admin = await this.adminRepository.findOne({ where: { id_admin: id } });
            if (!admin) {
                throw new Error(`No se encontró un administrador con el ID ${id}`);
            }
            if (updateAdminDto.password) {
                updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
            }
            await this.adminRepository.update(id, updateAdminDto);
            const updatedAdmin = await this.adminRepository.findOne({ where: { id_admin: id } });
            if (!updatedAdmin) {
                throw new Error(`Error al obtener administrador actualizado con ID ${id}`);
            }
            const { password, ...result } = updatedAdmin;
            return (0, api_response_util_1.CreateResponse)('Administrador actualizado exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Administrador no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar administrador', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const admin = await this.adminRepository.findOne({ where: { id_admin: id } });
            if (!admin) {
                throw new Error(`No se encontró un administrador con el ID ${id}`);
            }
            await this.adminRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Administrador eliminado exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Administrador no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar administrador', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map