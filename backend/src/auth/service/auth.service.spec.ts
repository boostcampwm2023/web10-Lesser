import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { GithubApiService } from 'src/github-api/github-api.service';
import { GithubUserDto } from './dto/github-user.dto';
import { TempMemberRepository } from '../repository/tempMember.repository';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { TempMember } from '../entity/tempMember.entity';
import { MemberService } from 'src/member/service/member.service';
import { Member } from 'src/member/entity/member.entity';

describe('Auth Service Unit Test', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let githubApiService: GithubApiService;
  let tempMemberRepository: TempMemberRepository;
  let lesserJwtService: LesserJwtService;
  let memberService: MemberService;

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
        {
          provide: TempMemberRepository,
          useValue: {
            save: jest.fn(),
            findByGithubId: jest.fn(),
            updateTempIdToken: jest.fn(),
          },
        },
        {
          provide: LesserJwtService,
          useValue: {
            createTempIdToken: jest.fn(),
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
          },
        },
        {
          provide: MemberService,
          useValue: {
            findByGithubId: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    githubApiService = module.get<GithubApiService>(GithubApiService);
    tempMemberRepository =
      module.get<TempMemberRepository>(TempMemberRepository);
    lesserJwtService = module.get<LesserJwtService>(LesserJwtService);
    memberService = module.get<MemberService>(MemberService);
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

  describe('Get TempIdToken', () => {
    const token = 'token';

    it('should save new temp member and return temp Id token', async () => {
      jest
        .spyOn(lesserJwtService, 'createTempIdToken')
        .mockResolvedValue(token);
      jest
        .spyOn(tempMemberRepository, 'findByGithubId')
        .mockResolvedValue(null);

      const githubUserDto = GithubUserDto.of('id', 'username', 'imageUrl');
      const tempIdToken = await authService.saveTempMember(githubUserDto);

      expect(tempIdToken).toEqual(token);
      expect(tempMemberRepository.findByGithubId).toHaveBeenCalled();
      expect(tempMemberRepository.save).toHaveBeenCalled();
      expect(tempMemberRepository.updateTempIdToken).not.toHaveBeenCalled();
    });

    it('should update temp member and return temp Id token', async () => {
      jest
        .spyOn(lesserJwtService, 'createTempIdToken')
        .mockResolvedValue(token);
      jest
        .spyOn(tempMemberRepository, 'findByGithubId')
        .mockResolvedValue(
          TempMember.of('uuid', 'oldToken', 1, 'username', 'imageUrl'),
        );

      const githubUserDto = GithubUserDto.of('1', 'username', 'imageUrl');
      const tempIdToken = await authService.saveTempMember(githubUserDto);

      expect(tempIdToken).toEqual(token);
      expect(tempMemberRepository.findByGithubId).toHaveBeenCalled();
      expect(tempMemberRepository.updateTempIdToken).toHaveBeenCalled();
      expect(tempMemberRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Github Authentication', () => {
    it('should return tempId token when github user is not member', async () => {
      jest
        .spyOn(authService, 'getAccessToken')
        .mockResolvedValue('access token');
      jest
        .spyOn(authService, 'getGithubUser')
        .mockResolvedValue(GithubUserDto.of('id', 'login', 'avatar_url'));
      jest.spyOn(memberService, 'findByGithubId').mockResolvedValue(null);
      jest
        .spyOn(authService, 'saveTempMember')
        .mockResolvedValue('tempIdToken');

      const result = await authService.githubAuthentication('auth code');

      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(authService.getGithubUser).toHaveBeenCalled();
      expect(memberService.findByGithubId).toHaveBeenCalled();
      expect(result).toHaveProperty('tempIdToken');
      expect((result as { tempIdToken: string }).tempIdToken).toEqual(
        'tempIdToken',
      );
    });
    it('should return access token and refresh token when github user is member', async () => {
      const lesserAccessToken = 'lesser access token';
      const lesserRefreshToken = 'lesser refresh token';
      const githubUserDto = GithubUserDto.of('1', 'username', 'image_url');
      const member = Member.of(
        githubUserDto.githubId,
        githubUserDto.username,
        githubUserDto.username,
      );
      const authCode = 'auth code';
      const accessToken = 'access token';
      member.id = 1;
      jest.spyOn(authService, 'getAccessToken').mockResolvedValue(accessToken);
      jest.spyOn(authService, 'getGithubUser').mockResolvedValue(githubUserDto);
      jest.spyOn(memberService, 'findByGithubId').mockResolvedValue(member);
      jest
        .spyOn(lesserJwtService, 'createAccessToken')
        .mockResolvedValue(lesserAccessToken);
      jest
        .spyOn(lesserJwtService, 'createRefreshToken')
        .mockResolvedValue(lesserRefreshToken);

      const result = await authService.githubAuthentication(authCode);

      expect(authService.getAccessToken).toHaveBeenCalledWith(authCode);
      expect(authService.getGithubUser).toHaveBeenCalledWith(accessToken);
      expect(memberService.findByGithubId).toHaveBeenCalledWith(
        githubUserDto.githubId,
      );
      expect(lesserJwtService.createAccessToken).toHaveBeenCalledWith(
        member.id,
      );
      expect(lesserJwtService.createRefreshToken).toHaveBeenCalledWith(
        member.id,
      );
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(
        (result as { accessToken: string; refreshToken: string }).accessToken,
      ).toEqual(lesserAccessToken);
      expect(
        (result as { accessToken: string; refreshToken: string }).refreshToken,
      ).toEqual(lesserRefreshToken);
    });
  });
});
