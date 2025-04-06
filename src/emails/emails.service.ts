import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto, SendEmailDtoByCountry } from './dto/emails.dto';
import { User } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoices/controllers/dto/create-invoice.dto';
import { CreateContactDto } from 'src/contacts/controllers/dto/create-dto';
import { CreateContactByCountryDto } from 'src/contacts/repositories/interfaces/contact.repository.interfaces';
import { CreateInvoiceByCountryDto } from 'src/invoices/services/interfaces/invoice.service.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport(countryId: number) {
    console.log(countryId);
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>(`EMAIL_HOST_${countryId}`),
      port: this.configService.get<number>(`EMAIL_PORT_${countryId}`),
      secure: false,
      auth: {
        user: this.configService.get<string>(`EMAIL_USER_${countryId}`),
        pass: this.configService.get<string>(`EMAIL_PASSWORD_${countryId}`),
      },
    });

    return transporter;
  }

  async sendEmail(dto: SendEmailDto, countryId: number) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport(countryId);

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>(`EMAIL_USER_${countryId}`),
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

  async sendContactEmail(dto: CreateContactByCountryDto, id: number) {
    const {
      email,
      message,
      name,
      company,
      phone,
      equipment,
      contactType,
      countryId,
    } = dto;
    const html = `<div style="font-size: 18px;"><p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefono:</strong> ${phone || 'No incluido.'}</p>
      <p><strong>Empresa:</strong> ${company}</p>
       ${contactType === 'SERVICE' ? `<p><strong>Equipo:</strong> ${equipment}</p>` : ``} 
      <p><strong>Mensaje:</strong> ${message}</p></div>`;

    await this.sendEmail(
      {
        html,
        recipients: [this.configService.get<string>(`RECIPIENTS_${countryId}`)],
        // recipients: ['contacto@fromm-pack.cl'],
        subject: `Solicitud de ${contactType === 'CONTACT' ? 'Contacto' : 'Servicio Técnico'} nro. ${id}`,
      },
      countryId,
    );
  }

  async sendContactConfirmationUser(user: User, id: number) {
    await this.sendEmail(
      {
        recipients: [user.email],
        subject: `Solicitud de contacto Nro. ${id}`,
        html: `<div style="font-size: 18px;"><p>Hola ${user.name}, hemos recibido tu solicitud, te contactaremos a la brevedad posible.</p>
              <p>Atentamente,<br >El quipo de Fromm Chile.</p>
                <img src="https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/FROMM_PACK%20large.jpg" alt="Fromm Chile" style="width: 500px; height: 100px;">
        </div>
      `,
      },
      user.countryId,
    );
  }

  async sendInvoiceConfirmationUser(
    user: User,
    dto: CreateInvoiceDto,
    id: number,
  ) {
    await this.sendEmail(
      {
        recipients: [user.email],
        subject: `Solicitud de cotización Nro. ${id}`,
        html: `<div style="font-size: 18px;"><p>Hola ${user.name}, hemos recibido tu solicitud, te contactaremos a la brevedad posible.</p>
        <h3 style="color: #007BFF;">Detalle de la Solicitud</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 50px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dto.invoiceDetails
                          .map(
                            (detail) => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${detail.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${detail.quantity}</td>
                            </tr>
                        `,
                          )
                          .join('')}
                    </tbody>
                </table>
                <p>Atentamente,<br >El quipo de Fromm Chile.</p>
                <img src="https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/FROMM_PACK%20large.jpg" alt="Fromm Chile" style="width: 500px; height: 100px;">
        </div>
      `,
      },
      user.countryId,
    );
  }

  async sendInvoiceDetails(dto: CreateInvoiceByCountryDto, Id: number) {
    const { invoiceDetails, name, company, phone, email, message, countryId } =
      dto;
    await this.sendEmail(
      {
        recipients: [this.configService.get<string>(`RECIPIENTS_${countryId}`)],
        // recipients: ['contacto@fromm-pack.cl'],
        subject: `Nueva Solicitud de Cotización, Nro: ${Id}`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
              <h2 style="color: #007BFF;">Solicitud de Cotización</h2>
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Correo:</strong> ${email}</p>
              <p><strong>Teléfono:</strong> ${phone || 'No incluido.'}</p>
              <p><strong>Empresa:</strong> ${company || 'No incluido.'}</p>
              <p><strong>Comentarios adicionales:</strong> ${message || 'Sin comentarios...'}</p>
              <h3 style="color: #007BFF;">Detalle de la Cotización</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <thead>
                      <tr style="background-color: #f2f2f2;">
                          <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                          <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${invoiceDetails
                        .map(
                          (detail) => `
                          <tr>
                              <td style="border: 1px solid #ddd; padding: 8px;">${detail.name}</td>
                              <td style="border: 1px solid #ddd; padding: 8px;">${detail.quantity}</td>
                          </tr>
                      `,
                        )
                        .join('')}
                  </tbody>
              </table>
          </div>
      `,
      },
      countryId,
    );
  }
}
