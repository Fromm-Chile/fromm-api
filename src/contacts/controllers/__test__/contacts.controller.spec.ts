import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from '../contacts.controller';
import { ContactsService } from '../../services/contacts.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Contact } from '@prisma/client';
import { CreateContactDto } from '../../dto/create-contact-dto';
import config from '../../../../config/config';
import { Country } from '../../../assets/enums';

const mockContactsService = {
  create: jest.fn(),
};

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

const mockContact: Contact = {
  id: 1,
  userId: 1,
  statusId: 1,
  name: 'Test Contact',
  phone: '+1234567890',
  email: 'test@example.com',
  company: 'Test Company',
  equipment: 'Laptop',
  contactType: 'CONTACT',
  message: 'Test message',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
};

describe('ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        JwtService,
        Reflector,
        PrismaService,
        {
          provide: ContactsService,
          useValue: mockContactsService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact for Chile', async () => {
      const createContactDto: CreateContactDto = {
        name: 'Test Contact',
        phone: '+1234567890',
        email: 'test@example.com',
        company: 'Test Company',
        equipment: 'Laptop',
        message: 'Test message',
      };

      mockContactsService.create.mockResolvedValue(mockContact);

      const result = await controller.create(createContactDto);

      expect(mockContactsService.create).toHaveBeenCalledWith({
        ...createContactDto,
        countryId: Country.CL,
      });
      expect(result).toEqual(mockContact);
    });
  });
});
