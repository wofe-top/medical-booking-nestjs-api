import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { DoctorProfile } from '../../doctors/schemas/doctor-profile.schema';

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Appointment extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    patientId!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: DoctorProfile.name, required: true })
    doctorId!: Types.ObjectId;

    @Prop({ required: true })
    appointmentDate!: Date;

    @Prop({ type: String, enum: AppointmentStatus, default: AppointmentStatus.PENDING })
    status!: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);