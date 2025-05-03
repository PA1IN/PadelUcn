import { Test, TestingModule } from '@nestjs/testing';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';

describe('BoletaEquipamientoService', () => {
  let service: BoletaEquipamientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoletaEquipamientoService],
    }).compile();

    service = module.get<BoletaEquipamientoService>(BoletaEquipamientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
