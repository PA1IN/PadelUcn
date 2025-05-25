import { Test, TestingModule } from '@nestjs/testing';
import { CanchasService } from './canchas.service';

describe('CanchasService', () => {
  let service: CanchasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanchasService],
    }).compile();

    service = module.get<CanchasService>(CanchasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
