import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersAdminService } from '../../../usersAdmin/services/usersAdmin.service';
import { JwtService } from '@nestjs/jwt';
import { UserAdmin } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersAdminService: UsersAdminService;
  let jwtService: JwtService;

  const mockUserAdmin: UserAdmin = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    roleId: 1,
    isActive: true,
  };

  const mockUsersAdminService = {
    getOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersAdminService,
          useValue: mockUsersAdminService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersAdminService = module.get<UsersAdminService>(UsersAdminService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user and return user data without password when credentials are correct', async () => {
      const email = 'test@example.com';
      const password = 'testPassword';

      mockUsersAdminService.getOneByEmail.mockResolvedValue(mockUserAdmin);
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersAdminService.getOneByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserAdmin.password,
      );
      expect(result).toEqual({
        id: mockUserAdmin.id,
        name: mockUserAdmin.name,
        email: mockUserAdmin.email,
        createdAt: mockUserAdmin.createdAt,
        updatedAt: mockUserAdmin.updatedAt,
        roleId: mockUserAdmin.roleId,
        isActive: mockUserAdmin.isActive,
      });
      expect(result.password).toBeUndefined();
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'testPassword';

      mockUsersAdminService.getOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(mockUsersAdminService.getOneByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';

      mockUsersAdminService.getOneByEmail.mockResolvedValue(mockUserAdmin);
      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersAdminService.getOneByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUserAdmin.password,
      );
      expect(result).toBeNull();
    });
  });

  describe('loginToken', () => {
    it('should generate JWT token and return user data when user is active', async () => {
      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.loginToken(mockUserAdmin);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        role: mockUserAdmin.roleId,
        sub: mockUserAdmin.id,
      });
      expect(result).toEqual({
        access_token: mockToken,
        name: mockUserAdmin.name,
        email: mockUserAdmin.email,
        isActive: mockUserAdmin.isActive,
        roleId: mockUserAdmin.roleId,
      });
    });

    it('should throw BadRequestException when user is not active', async () => {
      const inactiveUser: UserAdmin = {
        ...mockUserAdmin,
        isActive: false,
      };

      await expect(service.loginToken(inactiveUser)).rejects.toThrow(
        new BadRequestException('Tu cuenta no esta activada'),
      );

      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});
