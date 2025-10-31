import { Test, TestingModule } from '@nestjs/testing';
import { UsersAdminController } from '../users.admin.controller';
import { UsersService } from '../../services/users.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import config from 'config/config';

const mockUsersService = {
  getUsersAdmin: jest.fn(),
  findManyByEmail: jest.fn(),
};

const mockJwtService = {
  verifyAsync: jest.fn(),
};

const mockPrismaService = {
  userAdmin: {
    findUnique: jest.fn(),
  },
};

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

describe('UsersAdminController', () => {
  let controller: UsersAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAdminController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<UsersAdminController>(UsersAdminController);
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    const query = {
      countryCode: 'CL',
      page: 1,
      name: 'John',
      limit: 10,
      idOrder: 'asc32453',
    };
    it('returns a list of users and total pages', async () => {
      const mockResponse = {
        users: [
          {
            id: 1,
            name: 'Juan Carlos Rodriguez',
            email: 'juan.rodriguez@example.com',
            phone: '+56912345678',
            company: 'Tecnología Innovadora S.A.',
            rucPeru: '20123456789',
            countryId: 1,
            createdAt: new Date('2024-01-15T08:30:00.000Z'),
            updatedAt: new Date('2024-01-15T08:30:00.000Z'),
          },
        ],
        totalPages: 1,
      };
      mockUsersService.getUsersAdmin.mockResolvedValue(mockResponse);

      const result = await controller.getUsers(
        query.countryCode,
        query.page,
        query.name,
        query.limit,
        query.idOrder,
      );
      expect(result).toEqual(mockResponse);
      expect(mockUsersService.getUsersAdmin).toHaveBeenCalledWith({
        code: query.countryCode,
        page: query.page,
        name: query.name,
        limit: query.limit,
        idOrder: query.idOrder,
      });
    });
  });

  describe('findManyByEmail', () => {
    it('should find users by email and country code', async () => {
      const email = 'test@example.com';
      const countryCode = 'CL';
      const mockResponse = [
        {
          id: 1,
          name: 'Juan Carlos Rodriguez',
          email: 'test@example.com',
          phone: '+56912345678',
          company: 'Tecnología Innovadora S.A.',
          rucPeru: '20123456789',
          countryId: 1,
          createdAt: new Date('2024-01-15T08:30:00.000Z'),
          updatedAt: new Date('2024-01-15T08:30:00.000Z'),
        },
      ];

      mockUsersService.findManyByEmail.mockResolvedValue(mockResponse);

      const result = await controller.findManyByEmail(email, countryCode);

      expect(result).toEqual(mockResponse);
      expect(mockUsersService.findManyByEmail).toHaveBeenCalledWith({
        email,
        code: countryCode,
      });
    });
  });
});
