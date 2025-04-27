import { Injectable } from '@nestjs/common';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

@Injectable()
export class CanchasService {
  create(createCanchaDto: CreateCanchaDto) {
    return 'This action adds a new cancha';
  }

  findAll() {
    return `This action returns all canchas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cancha`;
  }

  update(id: number, updateCanchaDto: UpdateCanchaDto) {
    return `This action updates a #${id} cancha`;
  }

  remove(id: number) {
    return `This action removes a #${id} cancha`;
  }
}
