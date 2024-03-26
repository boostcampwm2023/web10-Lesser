import { Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { MemberService } from 'src/member/service/member.service';

describe('Auth Controller Unit Test', () => {
  let controller: AuthController;
  let authService: AuthService;
  let memberService: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getGithubAuthUrl: jest.fn(),
            githubAuthentication: jest.fn(),
            githubSignup: jest.fn(),
            logout: jest.fn(),
            refreshAccessTokenAndRefreshToken: jest.fn(),
            getGithubUsernameByTempIdToken: jest.fn(),
          },
        },
        {
          provide: MemberService,
          useValue: { getMemberPublicInfo: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    memberService = module.get<MemberService>(MemberService);
  });

  describe('Github Authentication', () => {
    const mockBody = { authCode: 'authCode' };
    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    it('should return tempid token', async () => {
      jest
        .spyOn(authService, 'githubAuthentication')
        .mockResolvedValue({ tempIdToken: 'tempIdToken' });

      await controller.githubAuthentication(mockBody, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith({
        tempIdToken: 'tempIdToken',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(209);
      expect(authService.githubAuthentication).toHaveBeenCalled();
    });

    it('should return access token, refresh token', async () => {
      jest.spyOn(authService, 'githubAuthentication').mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });
      jest.spyOn(memberService, 'getMemberPublicInfo').mockResolvedValue({
        username: 'username',
        githubImageUrl: 'githubImageUrl',
      });

      await controller.githubAuthentication(mockBody, mockResponse);

      expect(authService.githubAuthentication).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        accessToken: 'access token',
        member: {
          username: 'username',
          imageUrl: 'githubImageUrl',
        },
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh token',
        {
          httpOnly: true,
          secure: true,
          path: '/api/auth/',
          sameSite: 'none',
        },
      );
    });
  });
});
