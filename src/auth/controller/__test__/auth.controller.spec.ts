import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../service/auth.service';

const mockUser = { id: 1, email: 'test@example.com' };

const mockAuthService = {
  loginToken: jest.fn().mockResolvedValue({ access_token: 'mock-token' }),
  validateUser: jest.fn().mockResolvedValue(mockUser),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.loginToken with the user from request', async () => {
      const req = { user: mockUser };
      await controller.login(req);
      expect(mockAuthService.loginToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('verify', () => {
    it('should call authService.validateUser with the user from request', async () => {
      const mockBody = { email: 'test@example.com', password: 'test-password' };
      await controller.verifyToken(mockBody);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        mockBody.email,
        mockBody.password,
      );
    });
  });
});
