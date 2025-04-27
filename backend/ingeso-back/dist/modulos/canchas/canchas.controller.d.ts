import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
export declare class CanchasController {
    private readonly canchasService;
    constructor(canchasService: CanchasService);
    create(createCanchaDto: CreateCanchaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCanchaDto: UpdateCanchaDto): string;
    remove(id: string): string;
}
