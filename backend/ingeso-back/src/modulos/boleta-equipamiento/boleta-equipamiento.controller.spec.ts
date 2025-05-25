import { Test, TestingModule } from '@nestjs/testing';
import { BoletaEquipamientoController } from './boleta-equipamiento.controller';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';

describe('BoletaEquipamientoController', () => {
  let controller: BoletaEquipamientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoletaEquipamientoController],
      providers: [BoletaEquipamientoService],
    }).compile();

    controller = module.get<BoletaEquipamientoController>(BoletaEquipamientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
