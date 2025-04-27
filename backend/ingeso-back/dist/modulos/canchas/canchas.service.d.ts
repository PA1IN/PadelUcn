import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
export declare class CanchasService {
    create(createCanchaDto: CreateCanchaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCanchaDto: UpdateCanchaDto): string;
    remove(id: number): string;
}
