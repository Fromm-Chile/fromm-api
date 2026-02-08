import { Test, TestingModule } from '@nestjs/testing';
import { ContactsAdminController } from '../contacts.admin.controller';
import { ContactsService } from '../../services/contacts.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Contact } from '@prisma/client';
import config from '../../../../config/config';
import { Status } from '../../../assets/enums';

const mockContactsService = {
  getAllContacts: jest.fn(),
  getAllContactsByUserId: jest.fn(),
  getContactCount: jest.fn(),
  findOneContact: jest.fn(),
  updateContactType: jest.fn(),
  updateStatusDerivado: jest.fn(),
  updateStatus: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
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

const mockContacts: Contact[] = [mockContact];

describe('ContactsAdminController', () => {
  let controller: ContactsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsAdminController],
      providers: [
        Reflector,
        JwtService,
        PrismaService,
        {
          provide: ContactsService,
          useValue: mockContactsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ContactsAdminController>(ContactsAdminController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getContacts', () => {
    it('should return contacts with pagination', async () => {
      const mockResponse = {
        contactos: mockContacts,
        totalPages: 1,
      };

      mockContactsService.getAllContacts.mockResolvedValue(mockResponse);

      const result = await controller.getContacts(
        'CONTACT',
        'CL',
        0,
        'PENDIENTE',
        'Test',
        10,
        'desc',
      );

      expect(mockContactsService.getAllContacts).toHaveBeenCalledWith({
        contactType: 'CONTACT',
        code: 'CL',
        page: 0,
        status: 'PENDIENTE',
        name: 'Test',
        limit: 10,
        idOrder: 'desc',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getContactsByUserId', () => {
    it('should return contacts by user id', async () => {
      const userId = 1;
      const code = 'CL';

      mockContactsService.getAllContactsByUserId.mockResolvedValue(
        mockContacts,
      );

      const result = await controller.getContactsByUserId(userId, code);

      expect(mockContactsService.getAllContactsByUserId).toHaveBeenCalledWith(
        userId,
        code,
      );
      expect(result).toEqual(mockContacts);
    });
  });

  describe('getContactsCount', () => {
    it('should return contact counts', async () => {
      const mockCount = {
        totalCount: 10,
        pendingContacts: 3,
        invoiceContacts: 4,
        endedContacts: 3,
      };

      mockContactsService.getContactCount.mockResolvedValue(mockCount);

      const result = await controller.getContactsCount('CL', 'CONTACT');

      expect(mockContactsService.getContactCount).toHaveBeenCalledWith(
        'CL',
        'CONTACT',
      );
      expect(result).toEqual(mockCount);
    });
  });

  describe('findOneContact', () => {
    it('should return a contact by id', async () => {
      const contactId = '1';

      mockContactsService.findOneContact.mockResolvedValue(mockContact);

      const result = await controller.findOneContact(contactId);

      expect(mockContactsService.findOneContact).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockContact);
    });
  });

  describe('updateContactType', () => {
    it('should update contact type', async () => {
      const contactId = 1;

      mockContactsService.updateContactType.mockResolvedValue({
        ...mockContact,
        contactType: 'SERVICE',
      });

      const result = await controller.updateContactType(contactId);

      expect(mockContactsService.updateContactType).toHaveBeenCalledWith(
        contactId,
      );
      expect(result).toEqual({
        ...mockContact,
        contactType: 'SERVICE',
      });
    });
  });

  describe('updateStatusDerivado', () => {
    it('should update status to derivado', async () => {
      const contactId = 1;
      const department = 'IT Department';

      mockContactsService.updateStatusDerivado.mockResolvedValue({
        ...mockContact,
        message: `${mockContact.message} - Derivado a ${department}`,
      });

      const result = await controller.updateStatusDerivado(
        contactId,
        department,
      );

      expect(mockContactsService.updateStatusDerivado).toHaveBeenCalledWith(
        contactId,
        department,
      );
      expect(result).toEqual({
        ...mockContact,
        message: `${mockContact.message} - Derivado a ${department}`,
      });
    });
  });

  describe('updateStatusFinalizado', () => {
    it('should update status to finalizado', async () => {
      const contactId = 1;

      mockContactsService.updateStatus.mockResolvedValue({
        ...mockContact,
        statusId: Status.FINALIZADO,
      });

      const result = await controller.updateStatusFinalizado(contactId);

      expect(mockContactsService.updateStatus).toHaveBeenCalledWith(
        contactId,
        Status.FINALIZADO,
      );
      expect(result).toEqual({
        ...mockContact,
        statusId: Status.FINALIZADO,
      });
    });
  });
});
