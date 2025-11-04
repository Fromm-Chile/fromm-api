import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../emails.service';
import { User } from '@prisma/client';
import { SendEmailDto } from '../../dto/send-emails.dto';
import { CreateContactByCountryDto } from '../../../contacts/interfaces/contact.repository.interface';
import { CreateInvoiceByCountryDto } from '../../../invoices/services/interfaces/invoice.service.interface';
import { CreateInvoiceDto } from '../../../invoices/controllers/dto/create-invoice.dto';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
const mockNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

const mockTransporter = {
  sendMail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      EMAIL_HOST_1: 'smtp.chile.com',
      EMAIL_PORT_1: 587,
      EMAIL_USER_1: 'chile@fromm.com',
      EMAIL_PASSWORD_1: 'chile-password',
      EMAIL_HOST_2: 'smtp.peru.com',
      EMAIL_PORT_2: 587,
      EMAIL_USER_2: 'peru@fromm.com',
      EMAIL_PASSWORD_2: 'peru-password',
      RECIPIENTS_1: 'chile@recipients.com',
      RECIPIENTS_2: 'peru@recipients.com',
      SERVICE_RECIPIENTS_1_1: 'service-chile@recipients.com',
      SERVICE_RECIPIENTS_1_2: 'service-peru@recipients.com',
    };
    return config[key];
  }),
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

const mockUserPeru: User = {
  ...mockUser,
  id: 2,
  countryId: 2,
  rucPeru: '12345678901',
};

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);

    jest.clearAllMocks();
    mockNodemailer.createTransport.mockReturnValue(mockTransporter as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emailTransport', () => {
    it('should create transporter for Chile (countryId: 1)', () => {
      const result = service.emailTransport(1);

      expect(mockNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.chile.com',
        port: 587,
        secure: false,
        auth: {
          user: 'chile@fromm.com',
          pass: 'chile-password',
        },
      });
      expect(result).toBe(mockTransporter);
    });

    it('should create transporter for Peru (countryId: 2)', () => {
      const result = service.emailTransport(2);

      expect(mockNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.peru.com',
        port: 587,
        secure: false,
        auth: {
          user: 'peru@fromm.com',
          pass: 'peru-password',
        },
      });
      expect(result).toBe(mockTransporter);
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['test@example.com'],
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
        countryId: 1,
      };

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendEmail(sendEmailDto);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: ['test@example.com'],
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
      });
    });

    it('should handle email sending error', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['test@example.com'],
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
        countryId: 1,
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

      await service.sendEmail(sendEmailDto);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error sending mail: ',
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });
  });

  describe('sendContactEmail', () => {
    it('should send contact email for Chile', async () => {
      const createContactDto: CreateContactByCountryDto = {
        name: 'Test Contact',
        email: 'contact@example.com',
        phone: '+1234567890',
        company: 'Test Company',
        equipment: 'Laptop',
        message: 'Test message',
        contactType: 'CONTACT',
        countryId: 1,
      };

      const contactId = 123;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendContactEmail(createContactDto, contactId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: ['chile@recipients.com'],
        subject: 'Solicitud de Contacto nro. 123',
        html: expect.stringContaining('Test Contact'),
      });
    });

    it('should send service email with equipment info', async () => {
      const createContactDto: CreateContactByCountryDto = {
        name: 'Test Service',
        email: 'service@example.com',
        phone: '+1234567890',
        company: 'Test Company',
        equipment: 'Industrial Printer',
        message: 'Service request',
        contactType: 'SERVICE',
        countryId: 1,
      };

      const contactId = 456;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendContactEmail(createContactDto, contactId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: ['service-chile@recipients.com'],
        subject: 'Solicitud de Servicio Técnico nro. 456',
        html: expect.stringContaining('Industrial Printer'),
      });
    });

    it('should handle missing phone number', async () => {
      const createContactDto: CreateContactByCountryDto = {
        name: 'Test Contact',
        email: 'contact@example.com',
        phone: null,
        company: 'Test Company',
        equipment: 'Laptop',
        message: 'Test message',
        contactType: 'CONTACT',
        countryId: 2,
      };

      const contactId = 789;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendContactEmail(createContactDto, contactId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'peru@fromm.com',
        to: ['peru@recipients.com'],
        subject: 'Solicitud de Contacto nro. 789',
        html: expect.stringContaining('No incluido.'),
      });
    });
  });

  describe('sendContactConfirmationUser', () => {
    it('should send contact confirmation to user', async () => {
      const contactId = 123;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendContactConfirmationUser(mockUser, contactId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: [mockUser.email],
        subject: 'Solicitud de contacto Nro. 123',
        html: expect.stringContaining('Hola Test User'),
      });
    });

    it('should send confirmation for Peru user', async () => {
      const contactId = 456;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendContactConfirmationUser(mockUserPeru, contactId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'peru@fromm.com',
        to: [mockUserPeru.email],
        subject: 'Solicitud de contacto Nro. 456',
        html: expect.stringContaining('Fromm Chile'),
      });
    });
  });

  describe('sendInvoiceConfirmationUser', () => {
    it('should send invoice confirmation to user with details', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        company: 'Test Company',
        rucPeru: undefined,
        invoiceDetails: [
          { productId: 1, name: 'Product 1', quantity: 5 },
          { productId: 2, name: 'Product 2', quantity: 10 },
        ],
        message: 'Invoice message',
      };

      const invoiceId = 789;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendInvoiceConfirmationUser(
        mockUser,
        createInvoiceDto,
        invoiceId,
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: [mockUser.email],
        subject: 'Solicitud de cotización Nro. 789',
        html: expect.stringMatching(/Product 1.*5.*Product 2.*10/s),
      });
    });

    it('should handle empty invoice details', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        company: 'Test Company',
        rucPeru: undefined,
        invoiceDetails: [],
        message: 'Empty invoice',
      };

      const invoiceId = 101;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendInvoiceConfirmationUser(
        mockUser,
        createInvoiceDto,
        invoiceId,
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: [mockUser.email],
        subject: 'Solicitud de cotización Nro. 101',
        html: expect.stringContaining('Hola Test User'),
      });
    });
  });

  describe('sendInvoiceDetails', () => {
    it('should send invoice details to company', async () => {
      const createInvoiceDto: CreateInvoiceByCountryDto = {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '+1234567890',
        company: 'Customer Company',
        rucPeru: undefined,
        message: 'Invoice request',
        invoiceDetails: [
          { productId: 1, name: 'Product A', quantity: 3 },
          { productId: 2, name: 'Product B', quantity: 7 },
        ],
        countryId: 1,
      };

      const invoiceId = 999;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendInvoiceDetails(createInvoiceDto, invoiceId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: ['chile@recipients.com'],
        subject: 'Nueva Solicitud de Cotización, Nro: 999',
        html: expect.stringMatching(
          /Test Customer.*customer@example\.com.*Product A.*3.*Product B.*7/s,
        ),
      });
    });

    it('should handle missing optional fields', async () => {
      const createInvoiceDto: CreateInvoiceByCountryDto = {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: null,
        company: null,
        rucPeru: undefined,
        message: null,
        invoiceDetails: [{ productId: 1, name: 'Single Product', quantity: 1 }],
        countryId: 2,
      };

      const invoiceId = 555;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendInvoiceDetails(createInvoiceDto, invoiceId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'peru@fromm.com',
        to: ['peru@recipients.com'],
        subject: 'Nueva Solicitud de Cotización, Nro: 555',
        html: expect.stringContaining('No incluido'),
      });
    });

    it('should show "Sin comentarios" when message is null', async () => {
      const createInvoiceDto: CreateInvoiceByCountryDto = {
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '+1234567890',
        company: 'Test Company',
        rucPeru: undefined,
        message: null,
        invoiceDetails: [{ productId: 1, name: 'Test Product', quantity: 1 }],
        countryId: 1,
      };

      const invoiceId = 777;
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      await service.sendInvoiceDetails(createInvoiceDto, invoiceId);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'chile@fromm.com',
        to: ['chile@recipients.com'],
        subject: 'Nueva Solicitud de Cotización, Nro: 777',
        html: expect.stringContaining('Sin comentarios'),
      });
    });
  });
});
