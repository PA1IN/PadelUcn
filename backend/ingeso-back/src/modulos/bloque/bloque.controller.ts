import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BloqueService} from './bloque.service';
import { CreateBloqueDto, UpdateBloqueDto } from './dto/bloque.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import { Roles} from '../auth/decorators/roles.decorator';
import { ApiResponse } from '../../interface/Apiresponce';
import { Bloque } from './entities/bloque.entity';
import { get } from 'http';

@Controller('bloques')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BloqueController {
    constructor(private readonly bloqueService: BloqueService) {}
    @Post()
    @Roles('admin')
    async create(@Body() createBloqueDto: CreateBloqueDto): Promise<Bloque | null> {
        const result = await this.bloqueService.create(createBloqueDto);
        return result.data;
    }
    @Get()
    async findAll(): Promise<Bloque[]>{
        const result = await this.bloqueService.findAll();
        return result.data || [];
    }
    @Get('activos')
    async findActivos(): Promise<Bloque[]> {
        const result = await this.bloqueService.findActivos();
        return result.data || [];
    }
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Bloque | null> {
        const result = await this.bloqueService.findOne(+id);
        return result.data;
    }

    @Patch(':id')
    @Roles('admin')
    async update(
        @Param('id') id: string,
        @Body() updateBloqueDto: UpdateBloqueDto): Promise<Bloque | null> {
            const result = await this.bloqueService.update(+id, updateBloqueDto);
            return result.data;
        }
        @Delete(':id')
        @Roles('admin')
        async remove(@Param('id') id: string): Promise<null> {
            await this.bloqueService.remove(+id);
            return null;
        }
}