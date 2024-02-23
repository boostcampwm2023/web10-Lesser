import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

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
            getGithubUser: jest.fn(),
            getTempIdToken: jest.fn(),
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
        .mockRejectedValue(new Error('Cannot retrieve access token'));
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

    it('should return 401 response when getGithubUser throws an error', async () => {
      jest
        .spyOn(authService, 'getGithubUser')
        .mockRejectedValue(new Error('Cannot retrieve github user'));
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

    it('should return 500 response when getTempIdToken throws an error', async () => {
      jest
        .spyOn(authService, 'getTempIdToken')
        .mockRejectedValue(new Error());
      try {
        await controller.githubAuthentication({ authCode: 'authCode' });
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.response).toEqual({
          statusCode: 500,
          message: 'Internal Server Error',
        });
      }
    });
  });
});
