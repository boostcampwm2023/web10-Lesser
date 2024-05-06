import { Test, TestingModule } from '@nestjs/testing';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from '../entity/member.entity';
import { MemberRepository } from '../repository/member.repository';
import { MemberService } from './member.service';

describe('LesserJwtService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;
  let lesserJwtService: LesserJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            findByUsername: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: LesserJwtService,
          useValue: {
            getPayload: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    lesserJwtService = module.get<LesserJwtService>(LesserJwtService);
  });

  describe('Validate Username', () => {
    it('should return void when valid username', async () => {
      const username = 'username';

      jest.spyOn(memberRepository, 'findByUsername').mockResolvedValue(null);

      await expect(
        memberService.validateUsername(username),
      ).resolves.toBeUndefined();
      expect(memberRepository.findByUsername).toHaveBeenCalledWith(username);
    });

    it('should throw duplicate username when username already exist', async () => {
      const username = 'username';

      jest
        .spyOn(memberRepository, 'findByUsername')
        .mockResolvedValue(new Member());

      await expect(
        async () => await memberService.validateUsername(username),
      ).rejects.toThrow('duplicate username');
    });
  });

  describe('Get Member Public Info', () => {
    it('should return member public info when access token is valid', async () => {
      const accessToken = 'accessToken';
      const newMember = new Member();
      const id = 0;
      newMember.id = id;
      newMember.username = 'username';
      newMember.github_image_url = 'githubImageUrl';

      jest.spyOn(memberRepository, 'findById').mockResolvedValue(newMember);
      jest
        .spyOn(lesserJwtService, 'getPayload')
        .mockResolvedValue({ sub: { id } });

      const { username, githubImageUrl } =
        await memberService.getMemberPublicInfo(accessToken);
      expect(username).toBe(newMember.username);
      expect(githubImageUrl).toBe(newMember.github_image_url);
    });
  });

  describe('Get Member Info By Id', () => {
    const memberFixture = Member.of(
      123,
      'github_username',
      'avatar_url',
      'username',
      'position',
      { stacks: ['js', 'ts'] },
    );
    it('should return member when id is valid', async () => {
      const storedMember = { ...memberFixture };
      const id = 0;
      storedMember.id = id;

      jest.spyOn(memberRepository, 'findById').mockResolvedValue(storedMember);

      const foundMember = await memberService.getMember(id);
      expect(foundMember).toEqual(storedMember);
    });
  });
});
