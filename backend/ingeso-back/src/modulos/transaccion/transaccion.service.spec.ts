import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionService } from './transaccion.service';

describe('TransaccionService', () => {
  let service: TransaccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransaccionService],
    }).compile();

    service = module.get<TransaccionService>(TransaccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
