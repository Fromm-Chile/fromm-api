import { Test, TestingModule } from '@nestjs/testing';
import { ContactsRepository } from '../contacts.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Contact, Prisma } from '@prisma/client';
import { FilterContactDto } from '../../dto/filter-contact-dto';
import { UpdateContactDto } from '../../dto/update-dto';

const mockPrismaService = {
  contact: {
    create: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
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

const mockContacts: Contact[] = [
  mockContact,
  {
    ...mockContact,
    id: 2,
    name: 'Test Contact 2',
    email: 'test2@example.com',
  },
];

describe('ContactsRepository', () => {
  let repository: ContactsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ContactsRepository>(ContactsRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact', async () => {
      const contactData: Prisma.ContactCreateWithoutUserInput = {
        name: 'Test Contact',
        phone: '+1234567890',
        email: 'test@example.com',
        company: 'Test Company',
        equipment: 'Laptop',
        message: 'Test message',
      };
      const userId = 1;

      mockPrismaService.contact.create.mockResolvedValue(mockContact);

      const result = await repository.create(contactData, userId);

      expect(mockPrismaService.contact.create).toHaveBeenCalledWith({
        data: {
          ...contactData,
          status: {
            connect: {
              id: 1,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      expect(result).toEqual(mockContact);
    });
  });

  describe('statusCount', () => {
    it('should return status count', async () => {
      const code = 'CL';
      const status = 'PENDIENTE';
      const contactType = 'CONTACT';
      const expectedCount = 5;

      mockPrismaService.contact.count.mockResolvedValue(expectedCount);

      const result = await repository.statusCount(code, status, contactType);

      expect(mockPrismaService.contact.count).toHaveBeenCalledWith({
        where: {
          contactType,
          user: {
            country: {
              code,
            },
          },
          status: {
            name: status,
          },
        },
      });
      expect(result).toEqual(expectedCount);
    });
  });

  describe('totalCount', () => {
    it('should return total count', async () => {
      const code = 'CL';
      const contactType = 'CONTACT';
      const expectedCount = 10;

      mockPrismaService.contact.count.mockResolvedValue(expectedCount);

      const result = await repository.totalCount(code, contactType);

      expect(mockPrismaService.contact.count).toHaveBeenCalledWith({
        where: {
          contactType,
          user: {
            country: {
              code,
            },
          },
        },
      });
      expect(result).toEqual(expectedCount);
    });
  });

  describe('findAllContacts', () => {
    it('should return all contacts with filter', async () => {
      const filter: FilterContactDto = {
        page: 0,
        limit: 10,
        idOrder: 'desc',
        contactType: 'CONTACT',
        status: 'PENDIENTE',
        code: 'CL',
        name: 'Test',
      };

      mockPrismaService.contact.findMany.mockResolvedValue(mockContacts);

      const result = await repository.findAllContacts(filter);

      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          id: 'desc',
        },
        where: {
          contactType: filter.contactType,
          status: {
            name: filter.status,
          },
          user: {
            country: {
              code: filter.code,
            },
            name: {
              contains: filter.name,
            },
          },
        },
        include: {
          status: true,
        },
      });
      expect(result).toEqual(mockContacts);
    });

    it('should handle default values for pagination', async () => {
      const filter = {
        contactType: 'CONTACT',
        code: 'CL',
      } as FilterContactDto;

      mockPrismaService.contact.findMany.mockResolvedValue(mockContacts);

      await repository.findAllContacts(filter);

      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          id: 'desc',
        },
        where: {
          contactType: filter.contactType,
          status: {
            name: undefined,
          },
          user: {
            country: {
              code: filter.code,
            },
            name: {
              contains: undefined,
            },
          },
        },
        include: {
          status: true,
        },
      });
    });
  });

  describe('findCountPages', () => {
    it('should return count pages', async () => {
      const filter = {
        status: 'PENDIENTE',
        code: 'CL',
        name: 'Test',
      } as FilterContactDto;

      mockPrismaService.contact.count.mockResolvedValue(25);

      const result = await repository.findCountPages(filter);

      expect(mockPrismaService.contact.count).toHaveBeenCalledWith({
        where: {
          status: {
            name: filter.status,
          },
          user: {
            country: {
              code: filter.code,
            },
            name: {
              contains: filter.name,
            },
          },
        },
      });
      expect(result).toEqual(3);
    });
  });

  describe('findOneContact', () => {
    it('should return a contact by id', async () => {
      const contactId = 1;

      mockPrismaService.contact.findUnique.mockResolvedValue(mockContact);

      const result = await repository.findOneContact(contactId);

      expect(mockPrismaService.contact.findUnique).toHaveBeenCalledWith({
        where: { id: contactId },
        include: {
          status: true,
          user: {
            include: {
              country: true,
            },
          },
        },
      });
      expect(result).toEqual(mockContact);
    });
  });

  describe('findContactsByUserId', () => {
    it('should return contacts by user id', async () => {
      const userId = 1;
      const code = 'CL';

      mockPrismaService.contact.findMany.mockResolvedValue(mockContacts);

      const result = await repository.findContactsByUserId(userId, code);

      expect(mockPrismaService.contact.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          user: {
            country: {
              code,
            },
          },
        },
        include: {
          status: true,
          user: {
            include: {
              country: true,
            },
          },
        },
      });
      expect(result).toEqual(mockContacts);
    });
  });

  describe('update', () => {
    it('should update a contact', async () => {
      const contactId = 1;
      const updateContactDto: UpdateContactDto = {
        name: 'Updated Name',
        phone: '+9876543210',
      };
      const updatedContact = { ...mockContact, ...updateContactDto };

      mockPrismaService.contact.update.mockResolvedValue(updatedContact);

      const result = await repository.update(contactId, updateContactDto);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: contactId },
        data: {
          ...updateContactDto,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedContact);
    });
  });

  describe('updateStatus', () => {
    it('should update contact status', async () => {
      const contactId = 1;
      const statusId = 2;
      const updatedContact = { ...mockContact, statusId };

      mockPrismaService.contact.update.mockResolvedValue(updatedContact);

      const result = await repository.updateStatus(contactId, statusId);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: contactId },
        data: {
          status: {
            connect: {
              id: statusId,
            },
          },
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedContact);
    });
  });

  describe('updateContactType', () => {
    it('should update contact type to SERVICE', async () => {
      const contactId = 1;
      const updatedContact = { ...mockContact, contactType: 'SERVICE' };

      mockPrismaService.contact.update.mockResolvedValue(updatedContact);

      const result = await repository.updateContactType(contactId);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: contactId },
        data: {
          contactType: 'SERVICE',
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedContact);
    });
  });

  describe('updateStatusDerivado', () => {
    it('should update status to derivado with message', async () => {
      const contactId = 1;
      const message = 'Test message - Derivado a IT Department';
      const updatedContact = { ...mockContact, message };

      mockPrismaService.contact.update.mockResolvedValue(updatedContact);

      const result = await repository.updateStatusDerivado(contactId, message);

      expect(mockPrismaService.contact.update).toHaveBeenCalledWith({
        where: { id: contactId },
        data: {
          status: {
            connect: {
              id: 5,
            },
          },
          message,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedContact);
    });
  });

  describe('remove', () => {
    it('should delete a contact', async () => {
      const contactId = 1;

      mockPrismaService.contact.delete.mockResolvedValue(mockContact);

      const result = await repository.remove(contactId);

      expect(mockPrismaService.contact.delete).toHaveBeenCalledWith({
        where: { id: contactId },
      });
      expect(result).toEqual(mockContact);
    });
  });
});
