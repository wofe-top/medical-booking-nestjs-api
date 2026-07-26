import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Specialty is required' })
  specialty!: string;

  @IsString()
  @IsNotEmpty({ message: 'Bio is required' })
  bio!: string;

  @IsNumber()
  @Min(0, { message: 'Consultation fee must be a non-negative number' })
  consultationFee!: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}