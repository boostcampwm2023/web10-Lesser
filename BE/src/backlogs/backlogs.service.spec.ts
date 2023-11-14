import { Test, TestingModule } from '@nestjs/testing';
import { BacklogsService } from './backlogs.service';

describe('BacklogsService', () => {
  let service: BacklogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BacklogsService],
    }).compile();

    service = module.get<BacklogsService>(BacklogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
