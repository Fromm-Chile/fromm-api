import { Test, TestingModule } from '@nestjs/testing';
import { EmailControllerPeru } from '../emails.pe.controller';
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

describe('EmailControllerPeru', () => {
  let controller: EmailControllerPeru;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailControllerPeru],
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

    controller = module.get<EmailControllerPeru>(EmailControllerPeru);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send email for Peru with correct country ID', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['peru@example.com', 'lima@example.com'],
        subject: 'Prueba de Correo',
        html: '<h1>Contenido de prueba para Perú</h1>',
        text: 'Texto plano para Perú',
        countryId: 999, // This should be overridden to Country.PE
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        recipients: ['peru@example.com', 'lima@example.com'],
        subject: 'Prueba de Correo',
        html: '<h1>Contenido de prueba para Perú</h1>',
        text: 'Texto plano para Perú',
        countryId: Country.PE, // Should be set to Peru (2)
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });

    it('should handle email sending without text field for Peru', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['cliente@ejemplo.pe'],
        subject: 'Notificación Peru',
        html: '<p>Email de notificación para Perú</p>',
        countryId: 123, // This should be overridden
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        ...sendEmailDto,
        countryId: Country.PE,
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });

    it('should handle single recipient for Peru', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['individual@peru.com'],
        subject: 'Correo Individual',
        html: '<div><h2>Mensaje personalizado</h2><p>Este es un correo para Perú</p></div>',
        countryId: 456,
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        recipients: ['individual@peru.com'],
        subject: 'Correo Individual',
        html: '<div><h2>Mensaje personalizado</h2><p>Este es un correo para Perú</p></div>',
        countryId: Country.PE,
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });

    it('should override any provided country ID with Peru', async () => {
      const sendEmailDto: SendEmailDto = {
        recipients: ['override@test.com'],
        subject: 'Test Override',
        html: '<p>Testing country ID override</p>',
        countryId: Country.CL, // Even if Chile is provided, should be overridden to Peru
      };

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await controller.sendMail(sendEmailDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        recipients: ['override@test.com'],
        subject: 'Test Override',
        html: '<p>Testing country ID override</p>',
        countryId: Country.PE, // Should always be Peru for this controller
      });
      expect(result).toEqual({ message: 'Email sent successfully' });
    });
  });
});
