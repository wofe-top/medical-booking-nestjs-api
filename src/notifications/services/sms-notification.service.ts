import { Injectable, Logger } from '@nestjs/common';
import { INotificationService } from '../interfaces/notification-service.interface';

@Injectable()
export class SmsNotificationService implements INotificationService {
  private readonly logger = new Logger(SmsNotificationService.name);

  async sendAppointmentConfirmation(phoneNumber: string, details: any): Promise<boolean> {
    this.logger.log(`Sending SMS to ${phoneNumber}: Appointment confirmed for ${details.date}`);
    // Here you integrate Twilio, Unifonic, etc.
    return true;
  }

  async sendAppointmentReminder(phoneNumber: string, details: any): Promise<boolean> {
    this.logger.log(`Sending SMS reminder to ${phoneNumber}`);
    return true;
  }
}