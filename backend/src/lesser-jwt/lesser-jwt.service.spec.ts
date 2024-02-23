import { Test, TestingModule } from '@nestjs/testing';
import { LesserJwtService } from './lesser-jwt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('LesserJwtService', () => {
  let lesserJwtService: LesserJwtService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
        }),
      ],
      providers: [LesserJwtService],
    }).compile();

    lesserJwtService = module.get<LesserJwtService>(LesserJwtService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Get temp id token', () => {
    it('should return valid jwt', async () => {
      const key = 1;
      const tempIdToken = await lesserJwtService.createTempIdToken(key);
      const payload = jwtService.verify(tempIdToken);
      expect(payload.sub).toEqual(key);
    });
  });

  describe('Get jwt payload', () => {
    it('should return payload', async () => {
      const key = 1;
      const token = jwtService.sign({ sub: key });
      const payload = await lesserJwtService.getPayload(token);
      expect(payload.sub).toEqual(key);
    });

    it('should throw error when given invalid token', async () => {
      const token = 'invalid token';
      await expect(
        async () => await lesserJwtService.getPayload(token),
      ).rejects.toThrow();
    });

    it('should throw error when given expired token', async () => {
      const token = jwtService.sign({ sub: 1 }, { expiresIn: '-1' });
      await expect(
        async () => await lesserJwtService.getPayload(token),
      ).rejects.toThrow();
    });
  });
});
