import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

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
            githubSignup: jest.fn(),
            logout: jest.fn(),
            refreshAccessTokenAndRefreshToken: jest.fn(),
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
          path: '/api/auth/',
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
        expect(error.response.statusCode).toEqual(401);
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
        expect(error.response.statusCode).toEqual(401);
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
        expect(error.response.statusCode).toEqual(500);
      }
    });
  });

  describe('Github Signup', () => {
    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const mockBody = {
      username: 'username',
      position: 'position',
      techStack: ['javascript', 'typescript'],
    };

    interface CustomHeaders {
      authorization: string;
    }

    it('should throw UnauthorizedException if authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      } as Request & { headers: CustomHeaders };

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if authorization header format is invalid', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat',
        },
      } as Request & { headers: CustomHeaders };

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should pass if authorization header is in Bearer format', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request & { headers: CustomHeaders };
      jest.spyOn(authService, 'githubSignup').mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      await controller.githubSignup(mockRequest, mockBody, mockResponse);

      expect(authService.githubSignup).toHaveBeenCalled();
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
          path: '/api/auth/',
          sameSite: 'strict',
        },
      );
    });

    it('should throw 401 error when githubSignup service throws "Failed to verify token"', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expiredToken',
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'githubSignup')
        .mockRejectedValue(new Error('Failed to verify token'));

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 401 error when githubSignup service throws "tempIdToken does not match"', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expiredToken',
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'githubSignup')
        .mockRejectedValue(new Error('tempIdToken does not match'));

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return 500 response when githubSignup service throws unknown error', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request & { headers: CustomHeaders };
      jest.spyOn(authService, 'githubSignup').mockRejectedValue(new Error());

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Logout', () => {
    interface CustomHeaders {
      authorization: string;
    }
    const mockResponse = {
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    it('should return 200', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };

      await controller.logout(mockRequest, mockResponse);

      expect(authService.logout).toHaveBeenCalledWith(accessToken);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        httpOnly: true,
        secure: false,
        path: '/api/auth/',
        sameSite: 'strict',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw 401 error when logout service throws "Not a logged in member', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(new Error('Not a logged in member'));

      expect(
        async () => await controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 401 error when logout service throws "Failed to verify token', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(new Error('Failed to verify token'));

      expect(
        async () => await controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 500 error when logout service throws unknown error', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest.spyOn(authService, 'logout').mockRejectedValue(new Error());

      expect(
        async () => await controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Refresh', () => {
    const mockResponse = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown as Response;

    it('should return 201', async () => {
      const requestRefreshToken = 'refreshToken';
      const newAccessToken = 'newAccessToken';
      const newRefreshToken = 'newRefreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockResolvedValue({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

      await controller.refresh(mockRequest, mockResponse);

      expect(
        authService.refreshAccessTokenAndRefreshToken,
      ).toHaveBeenCalledWith(requestRefreshToken);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        accessToken: newAccessToken,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        newRefreshToken,
        {
          httpOnly: true,
          secure: false,
          path: '/api/auth/',
          sameSite: 'strict',
        },
      );
    });

    it('should throw 401 error when refresh service throws "No matching refresh token"', async () => {
      const requestRefreshToken = 'refreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockRejectedValue(new Error('No matching refresh token'));

      expect(
        async () => await controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 500 error when refresh service throws unknown error', async () => {
      const requestRefreshToken = 'refreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockRejectedValue(new Error());

      expect(
        async () => await controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
