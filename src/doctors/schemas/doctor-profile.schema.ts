import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Specialty } from '../../specialties/schemas/specialty.schema';

@Schema({ timestamps: true })
export class DoctorProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId!: Types.ObjectId;

  // Updated: Specialties linked via ObjectId references
  @Prop({ type: [{ type: Types.ObjectId, ref: Specialty.name }], required: true })
  specialties!: Types.ObjectId[];

  @Prop({ required: true })
  bio!: string;

  @Prop({ required: true })
  consultationFee!: number;

  @Prop({ default: true })
  isAvailable!: boolean;
}

export const DoctorProfileSchema = SchemaFactory.createForClass(DoctorProfile);