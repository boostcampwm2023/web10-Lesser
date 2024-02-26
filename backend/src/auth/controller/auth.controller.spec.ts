import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

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
            githubAuthentication: jest.fn(),
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
    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    it('should return tempid token', async () => {
      jest
        .spyOn(authService, 'githubAuthentication')
        .mockResolvedValue({ tempIdToken: 'tempIdToken' });

      await controller.githubAuthentication(
        {
          authCode: 'authCode',
        },
        mockResponse,
      );

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

      await controller.githubAuthentication(
        {
          authCode: 'authCode',
        },
        mockResponse,
      );

      expect(authService.githubAuthentication).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        accessToken: 'access token',
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh token',
        {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        },
      );
    });
    it('should return 401 response when githubAuthentication service throws "Cannot retrieve access token"', async () => {
      jest
        .spyOn(authService, 'githubAuthentication')
        .mockRejectedValue(new Error('Cannot retrieve access token'));

      try {
        await controller.githubAuthentication(
          { authCode: 'authCode' },
          mockResponse,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
    });

    it('should return 401 response when githubAuthentication service throws "Cannot retrieve github user"', async () => {
      jest
        .spyOn(authService, 'githubAuthentication')
        .mockRejectedValue(new Error('Cannot retrieve github user'));

      try {
        await controller.githubAuthentication(
          { authCode: 'authCode' },
          mockResponse,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }
    });

    it('should return 500 response when githubAuthentication service throws unknown error', async () => {
      jest
        .spyOn(authService, 'githubAuthentication')
        .mockRejectedValue(new Error());

      try {
        await controller.githubAuthentication(
          { authCode: 'authCode' },
          mockResponse,
        );
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
