import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from '../contacts.service';
import { ContactsRepository } from '../../repositories/contacts.repository';
import { UsersService } from '../../../users/services/users.service';
import { EmailService } from '../../../emails/emails.service';
import { Contact, User } from '@prisma/client';
import { CreateContactByCountryDto } from '../../interfaces/contact.repository.interface';
import { FilterContactDto } from '../../dto/filter-contact-dto';
import { UpdateContactDto } from '../../dto/update-dto';

const mockContactsRepository = {
  create: jest.fn(),
  totalCount: jest.fn(),
  statusCount: jest.fn(),
  findAllContacts: jest.fn(),
  findCountPages: jest.fn(),
  findContactsByUserId: jest.fn(),
  findOneContact: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  updateContactType: jest.fn(),
  updateStatusDerivado: jest.fn(),
  remove: jest.fn(),
};

const mockUsersService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

const mockEmailService = {
  sendContactEmail: jest.fn(),
  sendContactConfirmationUser: jest.fn(),
};

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  phone: '+1234567890',
  company: 'Test Company',
  countryId: 1,
  rucPeru: null,
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
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

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: ContactsRepository,
          useValue: mockContactsRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createContactDto: CreateContactByCountryDto = {
      userId: 1,
      name: 'Test Contact',
      phone: '+1234567890',
      email: 'test@example.com',
      company: 'Test Company',
      equipment: 'Laptop',
      message: 'Test message',
      countryId: 1,
    };

    it('should create a contact with existing user', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      mockContactsRepository.create.mockResolvedValue(mockContact);
      mockEmailService.sendContactEmail.mockResolvedValue(undefined);
      mockEmailService.sendContactConfirmationUser.mockResolvedValue(undefined);

      const result = await service.create(createContactDto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        createContactDto.email,
        createContactDto.countryId,
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();
      expect(mockContactsRepository.create).toHaveBeenCalledWith(
        {
          name: createContactDto.name,
          phone: createContactDto.phone,
          email: createContactDto.email,
          company: createContactDto.company,
          equipment: createContactDto.equipment,
          message: createContactDto.message,
          userId: 1,
        },
        1,
      );
      expect(mockEmailService.sendContactEmail).toHaveBeenCalledWith(
        createContactDto,
        mockContact.id,
      );
      expect(mockEmailService.sendContactConfirmationUser).toHaveBeenCalledWith(
        mockUser,
        mockContact.id,
      );
      expect(result).toEqual(mockContact);
    });

    it('should create a contact with new user', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockContactsRepository.create.mockResolvedValue(mockContact);
      mockEmailService.sendContactEmail.mockResolvedValue(undefined);
      mockEmailService.sendContactConfirmationUser.mockResolvedValue(undefined);

      const result = await service.create(createContactDto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        createContactDto.email,
        createContactDto.countryId,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: createContactDto.email,
        name: createContactDto.name,
        phone: createContactDto.phone,
        company: createContactDto.company,
        rucPeru: undefined,
        countryId: createContactDto.countryId,
      });
      expect(result).toEqual(mockContact);
    });
  });

  describe('getContactCount', () => {
    it('should return contact counts', async () => {
      const code = 'CL';
      const connectType = 'CONTACT';

      mockContactsRepository.totalCount.mockResolvedValue(10);
      mockContactsRepository.statusCount.mockResolvedValueOnce(3);
      mockContactsRepository.statusCount.mockResolvedValueOnce(4);
      mockContactsRepository.statusCount.mockResolvedValueOnce(3);

      const result = await service.getContactCount(code, connectType);

      expect(mockContactsRepository.totalCount).toHaveBeenCalledWith(
        code,
        connectType,
      );
      expect(mockContactsRepository.statusCount).toHaveBeenCalledWith(
        code,
        'PENDIENTE',
        connectType,
      );
      expect(mockContactsRepository.statusCount).toHaveBeenCalledWith(
        code,
        'COTIZACIÓN',
        connectType,
      );
      expect(mockContactsRepository.statusCount).toHaveBeenCalledWith(
        code,
        'FINALIZADO',
        connectType,
      );
      expect(result).toEqual({
        totalCount: 10,
        pendingContacts: 3,
        invoiceContacts: 4,
        endedContacts: 3,
      });
    });
  });

  describe('getAllContacts', () => {
    it('should return all contacts with pagination', async () => {
      const filter: FilterContactDto = {
        contactType: 'CONTACT',
        code: 'CL',
        page: 0,
        status: 'PENDIENTE',
        name: 'Test',
        limit: 10,
        idOrder: 'desc',
      };

      mockContactsRepository.findAllContacts.mockResolvedValue(mockContacts);
      mockContactsRepository.findCountPages.mockResolvedValue(2);

      const result = await service.getAllContacts(filter);

      expect(mockContactsRepository.findAllContacts).toHaveBeenCalledWith(
        filter,
      );
      expect(mockContactsRepository.findCountPages).toHaveBeenCalledWith(
        filter,
      );
      expect(result).toEqual({
        contactos: mockContacts,
        totalPages: 2,
      });
    });
  });

  describe('getAllContactsByUserId', () => {
    it('should return contacts by user id', async () => {
      const userId = 1;
      const code = 'CL';

      mockContactsRepository.findContactsByUserId.mockResolvedValue(
        mockContacts,
      );

      const result = await service.getAllContactsByUserId(userId, code);

      expect(mockContactsRepository.findContactsByUserId).toHaveBeenCalledWith(
        userId,
        code,
      );
      expect(result).toEqual(mockContacts);
    });
  });

  describe('findOneContact', () => {
    it('should return a contact by id', async () => {
      const contactId = 1;

      mockContactsRepository.findOneContact.mockResolvedValue(mockContact);

      const result = await service.findOneContact(contactId);

      expect(mockContactsRepository.findOneContact).toHaveBeenCalledWith(
        contactId,
      );
      expect(result).toEqual(mockContact);
    });
  });

  describe('update', () => {
    it('should update a contact', async () => {
      const contactId = 1;
      const updateContactDto: UpdateContactDto = {
        name: 'Updated Name',
        phone: '+9876543210',
      };

      mockContactsRepository.update.mockResolvedValue({
        ...mockContact,
        ...updateContactDto,
      });

      const result = await service.update(contactId, updateContactDto);

      expect(mockContactsRepository.update).toHaveBeenCalledWith(
        contactId,
        updateContactDto,
      );
      expect(result).toEqual({
        ...mockContact,
        ...updateContactDto,
      });
    });
  });

  describe('updateStatus', () => {
    it('should update contact status', async () => {
      const contactId = 1;
      const statusId = 2;

      mockContactsRepository.updateStatus.mockResolvedValue({
        ...mockContact,
        statusId,
      });

      const result = await service.updateStatus(contactId, statusId);

      expect(mockContactsRepository.updateStatus).toHaveBeenCalledWith(
        contactId,
        statusId,
      );
      expect(result).toEqual({
        ...mockContact,
        statusId,
      });
    });
  });

  describe('updateContactType', () => {
    it('should update contact type', async () => {
      const contactId = 1;

      mockContactsRepository.updateContactType.mockResolvedValue({
        ...mockContact,
        contactType: 'SERVICE',
      });

      const result = await service.updateContactType(contactId);

      expect(mockContactsRepository.updateContactType).toHaveBeenCalledWith(
        contactId,
      );
      expect(result).toEqual({
        ...mockContact,
        contactType: 'SERVICE',
      });
    });
  });

  describe('updateStatusDerivado', () => {
    it('should update status to derivado with department message', async () => {
      const contactId = 1;
      const department = 'IT Department';
      const expectedMessage = `${mockContact.message} - Derivado a ${department}`;

      mockContactsRepository.findOneContact.mockResolvedValue(mockContact);
      mockContactsRepository.updateStatusDerivado.mockResolvedValue({
        ...mockContact,
        message: expectedMessage,
      });

      const result = await service.updateStatusDerivado(contactId, department);

      expect(mockContactsRepository.findOneContact).toHaveBeenCalledWith(
        contactId,
      );
      expect(mockContactsRepository.updateStatusDerivado).toHaveBeenCalledWith(
        contactId,
        expectedMessage,
      );
      expect(result).toEqual({
        ...mockContact,
        message: expectedMessage,
      });
    });
  });

  describe('remove', () => {
    it('should remove a contact', async () => {
      const contactId = 1;

      mockContactsRepository.remove.mockResolvedValue(mockContact);

      const result = await service.remove(contactId);

      expect(mockContactsRepository.remove).toHaveBeenCalledWith(contactId);
      expect(result).toEqual(mockContact);
    });
  });
});
