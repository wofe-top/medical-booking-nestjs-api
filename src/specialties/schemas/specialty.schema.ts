import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Specialty extends Document {
  @Prop({ required: true, unique: true })
  name!: string; // e.g. Cardiology, Dermatology

  @Prop()
  description!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);