import { Test, TestingModule } from '@nestjs/testing';
import { Member } from '../entity/member.entity';
import { MemberRepository } from '../repository/member.repository';
import { MemberService } from './member.service';

describe('LesserJwtService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
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
});
