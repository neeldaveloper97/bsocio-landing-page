// bsocio-api/src/lib/mail/mail.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SentMessageInfo } from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { htmlToText } from 'html-to-text';

@Injectable()
export class MailService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private testAccount?: nodemailer.TestAccount;

  private async getTransporter(): Promise<
    nodemailer.Transporter<SentMessageInfo>
  > {
    if (!this.transporter) {
      const usingSmtp = Boolean(process.env.SMTP_HOST);
      this.logger.log(`Mail configuration: using SMTP=${usingSmtp}`);

      if (!usingSmtp) {
        this.testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: this.testAccount.smtp.host,
          port: this.testAccount.smtp.port,
          secure: this.testAccount.smtp.secure,
          auth: {
            user: this.testAccount.user,
            pass: this.testAccount.pass,
          },
        });
        this.logger.log(`🧪 Ethereal account created:`);
        this.logger.log(`   USER: ${this.testAccount.user}`);
        this.logger.log(`   PASS: ${this.testAccount.pass}`);
      } else {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const maskedUser = process.env.SMTP_USER
          ? `${process.env.SMTP_USER.replace(/(.).+(@.*)/, '$1***$2')}`
          : '<not-set>';
        const maskedHost = process.env.SMTP_HOST || '<not-set>';
        this.logger.log(
          `SMTP host=${maskedHost} user=${maskedUser} secure=${Number(process.env.SMTP_PORT) === 465}`,
        );
      }

      try {
        const success = await this.transporter.verify();
        this.logger.log(`🚀 Mail transporter is ready: ${success}`);
      } catch (err) {
        this.logger.error('Mail transporter verification failed', err as any);
        throw err;
      }
    }

    return this.transporter;
  }

  async sendMail(opts: {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
  }): Promise<SentMessageInfo> {
    const defaultFromAddress =
      process.env.MAIL_FROM ||
      `no-reply@${process.env.MAIL_DOMAIN || 'specsto.online'}`;
    const fromName = process.env.MAIL_FROM_NAME || 'BSocio Support';
    const from = opts.from || `"${fromName}" <${defaultFromAddress}>`;

    const transporter = await this.getTransporter();

    const finalText =
      opts.text || (opts.html ? htmlToText(opts.html) : undefined);

    this.logger.log(
      `Sending email from=${from} to=${Array.isArray(opts.to) ? opts.to.join(',') : opts.to} subject=${opts.subject}`,
    );

    try {
      const info = await transporter.sendMail({
        from,
        to: opts.to,
        cc: opts.cc,
        bcc: opts.bcc,
        subject: opts.subject,
        text: finalText,
        html: opts.html,
      });

      this.logger.log(`✉️  Email sent: ${info.messageId}`);

      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) {
        this.logger.log(`🔗 Preview URL: ${preview}`);
      }

      return info;
    } catch (err) {
      this.logger.error('Failed to send email', {
        from,
        to: opts.to,
        subject: opts.subject,
        error: (err as Error).message,
      });
      throw err;
    }
  }

  async sendTemplateMail(opts: {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    template: string; // ejs file without extension
    context: Record<string, any>;
    from?: string;
    text?: string;
  }): Promise<SentMessageInfo> {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'lib',
      'agents',
      'med-optimize',
      'views',
      `${opts.template}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, opts.context, {
      async: true,
    });
    const text = opts.text || htmlToText(html);

    return this.sendMail({
      from: opts.from,
      to: opts.to,
      cc: opts.cc,
      bcc: opts.bcc,
      subject: opts.subject,
      text,
      html,
    });
  }

  async onApplicationBootstrap() {
    this.getTransporter().catch((err) => {
      this.logger.warn('Mail transporter warm-up failed (non-blocking)', err);
    });
  }
}
