import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';

describe('Controller getGithubAuthServerUrl Unit Test', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getGithubAuthUrl: jest.fn().mockResolvedValue('github auth url'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return data from the service', async () => {
    const controllerResponse = controller.getGithubAuthServerUrl();
    const serviceResponse = authService.getGithubAuthUrl();
    expect(controllerResponse).toEqual(serviceResponse);
    expect(authService.getGithubAuthUrl).toHaveBeenCalled();
  });
});
