export interface INotificationService {
  sendAppointmentConfirmation(phoneNumber: string, details: any): Promise<boolean>;
  sendAppointmentReminder(phoneNumber: string, details: any): Promise<boolean>;
}