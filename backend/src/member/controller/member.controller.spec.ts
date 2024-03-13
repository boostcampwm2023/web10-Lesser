import { Controller, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '../service/member.service';
import { MemberController } from './member.controller';

describe('MemberController', () => {
  let memberController: MemberController;
  let memberService: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: {
            validateUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    memberController = module.get<MemberController>(MemberController);
    memberService = module.get<MemberService>(MemberService);
  });

  describe('Member Availability Username', () => {
    const username = 'username';
    it('should return true when valid username', async () => {
      const controllerResponse =
        await memberController.availabilityUsername(username);

      expect(memberService.validateUsername).toHaveBeenCalledWith(username);
      expect(controllerResponse.available).toBe(true);
    });

    it('should return false when duplicate username', async () => {
      jest
        .spyOn(memberService, 'validateUsername')
        .mockRejectedValue(new Error('duplicate username'));

      const controllerResponse =
        await memberController.availabilityUsername(username);

      expect(memberService.validateUsername).toHaveBeenCalledWith(username);
      expect(controllerResponse.available).toBe(false);
      expect(controllerResponse.message).toBe('duplicate username');
    });

    it('should throw 500 error when unknown error', async () => {
      jest
        .spyOn(memberService, 'validateUsername')
        .mockRejectedValue(new Error());

      expect(
        async () => await memberController.availabilityUsername(username),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
