import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength
} from 'class-validator';
import { Gender, Role } from '../../users/schemas/user.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';




export class RegisterDto {
  @ApiProperty({ example: 'Dr. Ahmed Ali', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'doctor@example.com', description: 'Unique email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: '+963911223344', description: 'Phone number in E.164 format' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;



  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.DOCTOR })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: 'Specialist in Cardiology with 10 years experience' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 50, description: 'Consultation fee in USD' })
  @IsOptional()
  consultationFee?: number;


  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each specialty must be a valid Mongo ID' })
  specialtyIds?: string[];
}