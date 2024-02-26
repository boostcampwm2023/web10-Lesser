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

  describe('Create temp id token', () => {
    it('should return valid jwt', async () => {
      const uuid = 'uuid';
      const tempIdToken = await lesserJwtService.createTempIdToken(uuid);
      const payload = jwtService.verify(tempIdToken);
      expect(payload.sub.uuid).toEqual(uuid);
      expect(payload.tokenType).toEqual('tempId');
    });
  });

  describe('Create access token', () => {
    it('should return valid jwt', async () => {
      const id = 1;
      const accessToken = await lesserJwtService.createAccessToken(id);
      const payload = jwtService.verify(accessToken);
      expect(payload.sub.id).toEqual(id);
      expect(payload.tokenType).toEqual('access');
    });
  });

  describe('Create refresh token', () => {
    it('should return valid jwt', async () => {
      const id = 1;
      const refreshToken = await lesserJwtService.createRefreshToken(id);
      const payload = jwtService.verify(refreshToken);
      expect(payload.sub.id).toEqual(id);
      expect(payload.tokenType).toEqual('refresh');
    });
  });

  describe('Get jwt payload', () => {
    it('should return payload', async () => {
      const sub = { uuid: '' };
      const tokenType = 'access';
      const token = jwtService.sign({ sub, tokenType });
      const payload = await lesserJwtService.getPayload(token, tokenType);
      expect(payload.sub).toEqual(sub);
    });

    it('should throw error when given invalid token', async () => {
      const token = 'invalid token';
      await expect(
        async () => await lesserJwtService.getPayload(token, 'access'),
      ).rejects.toThrow();
    });

    it('should throw error when given expired token', async () => {
      const token = jwtService.sign({ sub: 1 }, { expiresIn: '-1' });
      await expect(
        async () => await lesserJwtService.getPayload(token, 'access'),
      ).rejects.toThrow();
    });

    it('should throw error when token type miss-match', async () => {
      const sub = { uuid: '' };
      const tokenTypes = ['access', 'refresh', 'tempId'];
      for (const tokenType of tokenTypes) {
        const invalidType = tokenTypes.find((type) => type !== tokenType);
        const token = jwtService.sign({ sub, tokenType });
        expect(
          async () =>
            await lesserJwtService.getPayload(
              token,
              invalidType as 'access' | 'refresh' | 'tempId',
            ),
        ).rejects.toThrow();
      }
    });
  });
});
