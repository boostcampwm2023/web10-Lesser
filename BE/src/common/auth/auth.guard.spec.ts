import { IsLoginGuard } from './IsLogin.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new IsLoginGuard()).toBeDefined();
  });
});
