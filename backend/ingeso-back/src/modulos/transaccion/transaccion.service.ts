import { Injectable } from '@nestjs/common';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';

@Injectable()
export class TransaccionService {
  create(createTransaccionDto: CreateTransaccionDto) {
    return 'This action adds a new transaccion';
  }

  findAll() {
    return `This action returns all transaccion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaccion`;
  }

  update(id: number, updateTransaccionDto: UpdateTransaccionDto) {
    return `This action updates a #${id} transaccion`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaccion`;
  }
}
