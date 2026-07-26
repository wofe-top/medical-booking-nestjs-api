import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @IsMongoId({ message: 'Invalid appointment ID' })
  @IsNotEmpty()
  appointmentId!: string;

  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount!: number;

  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  @IsNotEmpty()
  method!: PaymentMethod;

  @IsOptional()
  @IsString()
  transactionId?: string;
}