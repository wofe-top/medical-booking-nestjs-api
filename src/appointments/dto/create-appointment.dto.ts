import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsMongoId({ message: 'Invalid doctor profile ID' })
  @IsNotEmpty({ message: 'Doctor ID is required' })
  doctorId!: string;

  @IsDateString({}, { message: 'Please provide a valid ISO date string' })
  @IsNotEmpty({ message: 'Appointment date is required' })
  appointmentDate!: string;
}