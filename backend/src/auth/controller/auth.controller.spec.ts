import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('Auth Controller Unit Test', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getGithubAuthUrl: jest.fn(),
            getAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Get Github Auth Server Url', () => {
    it('should return data from the service', async () => {
      jest
        .spyOn(authService, 'getGithubAuthUrl')
        .mockReturnValue('github auth url');
      const controllerResponse = controller.getGithubAuthServerUrl();
      const serviceResponse = authService.getGithubAuthUrl();
      expect(controllerResponse.authUrl).toEqual(serviceResponse);
      expect(authService.getGithubAuthUrl).toHaveBeenCalled();
    });
  });

  describe('Github Authentication', () => {
    it('should return 401 response when getAccessToken throws an error', async () => {
      jest
        .spyOn(authService, 'getAccessToken')
        .mockRejectedValue(new Error('Authentication failed'));

      try {
        await controller.githubAuthentication({ authCode: 'authCode' });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
    });
  });
});
