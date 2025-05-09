import { Test, TestingModule } from '@nestjs/testing';
import { EquipamientoController } from './equipamiento.controller';
import { EquipamientoService } from './equipamiento.service';

describe('EquipamientoController', () => {
  let controller: EquipamientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipamientoController],
      providers: [EquipamientoService],
    }).compile();

    controller = module.get<EquipamientoController>(EquipamientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
