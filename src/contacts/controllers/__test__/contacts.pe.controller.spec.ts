import { Test, TestingModule } from '@nestjs/testing';
import { ContactsControllerPeru } from '../contacts.pe.controller';
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

describe('ContactsControllerPeru', () => {
  let controller: ContactsControllerPeru;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsControllerPeru],
      providers: [
        Reflector,
        JwtService,
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

    controller = module.get<ContactsControllerPeru>(ContactsControllerPeru);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should handle contact creation with RUC Peru', async () => {
      const createContactDto: CreateContactDto = {
        userId: 1,
        name: 'Test Contact Peru',
        phone: '+51123456789',
        email: 'test@example.pe',
        company: 'Test Company Peru',
        rucPeru: '12345678901',
        equipment: 'Laptop',
        message: 'Test message with RUC',
      };

      mockContactsService.create.mockResolvedValue(mockContact);

      const result = await controller.create(createContactDto);

      expect(mockContactsService.create).toHaveBeenCalledWith({
        ...createContactDto,
        countryId: Country.PE,
      });
      expect(result).toEqual(mockContact);
    });
  });
});
