import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../local.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';

const mockAuthService = {
  validateUser: jest.fn(),
};

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'test-password',
};
describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);

    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return a user if validation is successful', async () => {
      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockUser.email, mockUser.password);
      expect(result).toEqual(mockUser);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(
        strategy.validate(mockUser.email, 'wrong-password'),
      ).rejects.toThrow(new UnauthorizedException('not allowed'));
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        mockUser.email,
        'wrong-password',
      );
    });
  });
});
