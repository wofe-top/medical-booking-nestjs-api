import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../schemas/appointment.schema';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus, { message: 'Invalid appointment status' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: AppointmentStatus;
}