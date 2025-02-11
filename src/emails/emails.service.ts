import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto, SendContactEmailDto } from './dto/emails.dto';
import { User } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoices/controllers/dto/create-invoice.dto';

const templates = [
  {
    name: 'Contact',
    html: '',
  },
];

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    return transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject: subject,
      html: html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
    }
  }

  async sendContactEmail(dto: SendContactEmailDto) {
    const {
      contactDto: {
        email,
        message,
        name,
        company,
        phone,
        equipment,
        contactType,
      },
      recipients,
    } = dto;
    const html = `<div style="font-size: 18px;"><p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefono:</strong> ${phone}</p>
      <p><strong>Empresa:</strong> ${company}</p>
        <p><strong>Equipo:</strong> ${equipment || 'NO APLICA.'}</p>
      <p><strong>Mensaje:</strong> ${message}</p></div>`;

    await this.sendEmail({
      html,
      recipients,
      subject: `Solicitud de ${contactType === 'CONTACT' ? 'Contacto' : 'Servicio Técnico'}`,
    });
  }
  async sendConfirmationUser(user: User) {
    await this.sendEmail({
      recipients: [user.email],
      subject: 'Gracias por contactarnos',
      html: `<div style="font-size: 18px;"><p>Hola ${user.name}, hemos recibido tu solicitud te contactaremos a la brevedad posible</p>`,
    });
  }

  async sendInvoiceDetails(dto: CreateInvoiceDto) {
    const { invoiceDetails, name, company, phone, email } = dto;
    await this.sendEmail({
      recipients: ['guzman.tech.cl@gmail.com'],
      subject: 'Nueva Solicitud de Cotización',
      html: `<div style="font-size: 18px;"><p><strong>Nombre</strong>: ${name}</p>
        <p><strong>Correo</strong>: ${email}</p><p><strong>Teléfono</strong>: ${phone || 'no incluido.'}</p><p><strong>Empresa</strong>: ${company || 'no incluido'}</p>
        <p><strong>Detalle de la cotización</strong></p>${invoiceDetails.map((detail) => `<p>Producto: ${detail.name} Cantidad: ${detail.quantity}</p>`).join('')}
        </div>`,
    });
  }
}
