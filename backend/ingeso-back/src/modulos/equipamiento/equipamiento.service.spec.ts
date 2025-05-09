import { Test, TestingModule } from '@nestjs/testing';
import { EquipamientoService } from './equipamiento.service';

describe('EquipamientoService', () => {
  let service: EquipamientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipamientoService],
    }).compile();

    service = module.get<EquipamientoService>(EquipamientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
