import { Test, TestingModule } from '@nestjs/testing';
import { CanchasController } from './canchas.controller';
import { CanchasService } from './canchas.service';

describe('CanchasController', () => {
  let controller: CanchasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CanchasController],
      providers: [CanchasService],
    }).compile();

    controller = module.get<CanchasController>(CanchasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
