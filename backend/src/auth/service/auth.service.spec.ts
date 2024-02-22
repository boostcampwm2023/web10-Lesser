import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GithubApiService } from 'src/github-api/github-api.service';
import { GithubUserDto } from './dto/github-user.dto';

describe('Auth Service Unit Test', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let githubApiService: GithubApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: GithubApiService,
          useValue: {
            fetchAccessToken: jest.fn(),
            fetchGithubUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    githubApiService = module.get<GithubApiService>(GithubApiService);
  });

  describe('Get Github Auth Url', () => {
    it('should return a valid GitHub authorization URL', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('client_id');
      const authUrl = authService.getGithubAuthUrl();
      const urlPattern = new RegExp(
        `^https://github.com/login/oauth/authorize\\?client_id=[\\w]+&scope=[\\w]*$`,
      );
      expect(authUrl).toMatch(urlPattern);
    });
  });

  describe('Get AccessToken', () => {
    it('should return github access token', async () => {
      jest
        .spyOn(githubApiService, 'fetchAccessToken')
        .mockResolvedValue({ access_token: 'access token' });
      const accessToken = await authService.getAccessToken('auth code');
      expect(accessToken).toEqual('access token');
      expect(githubApiService.fetchAccessToken).toHaveBeenCalled();
    });

    it('should return Error when given invalid authorization code', async () => {
      jest
        .spyOn(githubApiService, 'fetchAccessToken')
        .mockResolvedValue({ access_token: undefined });
      try {
        await authService.getAccessToken('auth code');
      } catch (error) {
        expect(error.message).toEqual('Cannot retrieve access token');
      }
    });

    it('should return Error when failed to access GitHub API', async () => {
      jest
        .spyOn(githubApiService, 'fetchAccessToken')
        .mockRejectedValue(new Error());
      try {
        await authService.getAccessToken('auth code');
      } catch (error) {
        expect(error.message).toEqual('Cannot retrieve access token');
      }
    });
  });

  describe('Get GitHub User', () => {
    it('should return github user', async () => {
      jest.spyOn(githubApiService, 'fetchGithubUser').mockResolvedValue({
        id: 'github_id',
        login: 'username',
        avatar_url: 'image_url',
      });
      const githubUser = await authService.getGithubUser('access token');
      expect(githubUser).toBeInstanceOf(GithubUserDto);
      expect(githubApiService.fetchGithubUser).toHaveBeenCalled();
    });

    it('should return Error when failed to access GitHub API', async () => {
      jest
        .spyOn(githubApiService, 'fetchGithubUser')
        .mockRejectedValue(new Error());
      try {
        await authService.getGithubUser('access token');
      } catch (error) {
        expect(error.message).toEqual('Cannot retrieve github user');
      }
    });
  });
});
