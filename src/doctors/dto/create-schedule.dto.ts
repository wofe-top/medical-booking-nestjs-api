import { IsEnum, IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';
import { DayOfWeek } from '../schemas/doctor-schedule.schema';

export class CreateScheduleDto {
  @IsEnum(DayOfWeek, { message: 'Invalid day of week' })
  @IsNotEmpty()
  day!: DayOfWeek;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format' })
  startTime!: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format' })
  endTime!: string;

  @IsNumber()
  @Min(10, { message: 'Slot duration must be at least 10 minutes' })
  slotDurationMinutes!: number;
}