import { Test, TestingModule } from '@nestjs/testing';
import { LesserJwtService } from './lesser-jwt.service';

describe('LesserJwtService', () => {
  let service: LesserJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LesserJwtService],
    }).compile();

    service = module.get<LesserJwtService>(LesserJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
