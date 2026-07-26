import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DoctorProfile } from './doctor-profile.schema';

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

@Schema({ timestamps: true })
export class DoctorSchedule extends Document {
  @Prop({ type: Types.ObjectId, ref: DoctorProfile.name, required: true })
  doctorId!: Types.ObjectId;

  @Prop({ type: String, enum: DayOfWeek, required: true })
  day!: DayOfWeek;

  @Prop({ required: true }) // e.g., "09:00"
  startTime!: string;

  @Prop({ required: true }) // e.g., "17:00"
  endTime!: string;

  @Prop({ default: 30 }) // Duration per appointment in minutes
  slotDurationMinutes!: number;
}

export const DoctorScheduleSchema = SchemaFactory.createForClass(DoctorSchedule);