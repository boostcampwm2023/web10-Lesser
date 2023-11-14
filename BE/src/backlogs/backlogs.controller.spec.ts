import { Test, TestingModule } from '@nestjs/testing';
import { BacklogsController } from './backlogs.controller';

describe('BacklogsController', () => {
  let controller: BacklogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BacklogsController],
    }).compile();

    controller = module.get<BacklogsController>(BacklogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
