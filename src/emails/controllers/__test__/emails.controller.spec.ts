import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '../emails.controller';
import { EmailService } from '../../services/emails.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SendEmailDto } from '../../dto/send-emails.dto';
import config from '../../../../config/config';
import { Country } from '../../../assets/enums';

const mockEmailService = {
  sendEmail: jest.fn(),
};

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

describe('EmailController', () => {
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        JwtService,
        Reflector,
        PrismaService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send email for Chile with correct country ID', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['test@example.com', 'another@example.com'],
        subject: 'Test Subject',
        html: '<h1>Test Email Content</h1>',
        text: 'Test plain text',
        countryId: 999, // This should be overridden to Country.CL
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        recipients: ['test@example.com', 'another@example.com'],
        subject: 'Test Subject',
        html: '<h1>Test Email Content</h1>',
        text: 'Test plain text',
        countryId: Country.CL, // Should be set to Chile (1)
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });

    it('should handle email sending without text field', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['single@example.com'],
        subject: 'Another Test',
        html: '<p>Another test email</p>',
        countryId: 123, // This should be overridden
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        ...sendEmailDto,
        countryId: Country.CL,
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });

    it('should handle multiple recipients', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: [
          'user1@example.com',
          'user2@example.com',
          'user3@example.com',
        ],
        subject: 'Bulk Email Test',
        html: '<div>Bulk email content</div>',
        countryId: 456,
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        recipients: [
          'user1@example.com',
          'user2@example.com',
          'user3@example.com',
        ],
        subject: 'Bulk Email Test',
        html: '<div>Bulk email content</div>',
        countryId: Country.CL,
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });
  });
});
