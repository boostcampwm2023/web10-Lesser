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
            findByUuid: jest.fn(),
          },
        },
        {
          provide: LesserJwtService,
          useValue: {
            createTempIdToken: jest.fn(),
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
            getPayload: jest.fn(),
          },
        },
        {
          provide: MemberService,
          useValue: {
            findByGithubId: jest.fn(),
            save: jest.fn(),
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

  describe('Save tempMember and get tempIdToken', () => {
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
      const updatedTempIdToken = 'updated temp id token';
      const tempMember = TempMember.of(
        'uuid',
        'oldToken',
        1,
        'username',
        'imageUrl',
      );
      jest
        .spyOn(lesserJwtService, 'createTempIdToken')
        .mockResolvedValue(updatedTempIdToken);
      jest
        .spyOn(tempMemberRepository, 'findByGithubId')
        .mockResolvedValue(tempMember);

      const githubUserDto = GithubUserDto.of('1', 'username', 'imageUrl');
      const tempIdToken = await authService.saveTempMember(githubUserDto);

      expect(tempIdToken).toEqual(updatedTempIdToken);
      expect(tempMemberRepository.findByGithubId).toHaveBeenCalled();
      expect(tempMemberRepository.updateTempIdToken).toHaveBeenCalledWith(
        tempMember.uuid,
        updatedTempIdToken,
      );
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
        githubUserDto.githubUsername,
        githubUserDto.githubImageUrl,
        'username',
        'position',
        { stacks: ['javascript', 'typescript'] },
      );
      const authCode = 'auth code';
      const accessToken = 'access token';
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

  describe('Get TempMember', () => {
    const tempIdToken = 'tempIdToken';
    const uuid = 'uuid';
    const tempId = 'tempId';
    const payload = { sub: { uuid }, tokenType: tempId };

    it('should return temp member', async () => {
      jest.spyOn(lesserJwtService, 'getPayload').mockResolvedValue(payload);
      jest
        .spyOn(tempMemberRepository, 'findByUuid')
        .mockResolvedValue(
          TempMember.of(uuid, tempIdToken, 0, 'username', 'image_url'),
        );

      const tempMember = await authService.getTempMember(tempIdToken);

      expect(lesserJwtService.getPayload).toHaveBeenCalledWith(
        tempIdToken,
        tempId,
      );
      expect(tempMemberRepository.findByUuid).toHaveBeenCalledWith(uuid);
      expect(tempMember.uuid).toEqual(uuid);
      expect(tempIdToken).toEqual(tempMember.temp_id_token);
    });

    it('should Throw Error when tempIdToken does not match', async () => {
      const notMatchToken = 'notMatchToken';
      jest.spyOn(lesserJwtService, 'getPayload').mockResolvedValue(payload);
      jest
        .spyOn(tempMemberRepository, 'findByUuid')
        .mockResolvedValue(
          TempMember.of(uuid, notMatchToken, 0, 'username', 'image_url'),
        );

      expect(
        async () => await authService.getTempMember(tempIdToken),
      ).rejects.toThrow('tempIdToken does not match');
    });
  });

  describe('Github signup', () => {
    const tempIdToken = 'tempIdToken';
    const uuid = 'uuid';
    const tempMember = TempMember.of(
      uuid,
      tempIdToken,
      0,
      'username',
      'image_url',
    );
    const username = 'username';
    const position = 'position';
    const techStack = { stacks: ['javascript', 'typescript'] };
    const memberId = 1;
    const lesserAccessToken = 'lesserAccessToken';
    const lesserRefreshToken = 'lesserRefreshToken';

    it('should return access token and refresh token', async () => {
      jest.spyOn(authService, 'getTempMember').mockResolvedValue(tempMember);
      jest.spyOn(memberService, 'save').mockResolvedValue(memberId);
      jest
        .spyOn(lesserJwtService, 'createAccessToken')
        .mockResolvedValue(lesserAccessToken);
      jest
        .spyOn(lesserJwtService, 'createRefreshToken')
        .mockResolvedValue(lesserRefreshToken);

      await authService.githubSignup(
        tempIdToken,
        username,
        position,
        techStack,
      );

      expect(authService.getTempMember).toHaveBeenCalledWith(tempIdToken);
      expect(memberService.save).toHaveBeenCalledWith(
        tempMember.github_id,
        tempMember.username,
        tempMember.image_url,
        username,
        position,
        techStack,
      );
      expect(lesserJwtService.createAccessToken).toHaveBeenCalledWith(memberId);
      expect(lesserJwtService.createRefreshToken).toHaveBeenCalledWith(
        memberId,
      );
    });
  });
});
