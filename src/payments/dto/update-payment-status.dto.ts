import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  @IsNotEmpty()
  status!: PaymentStatus;
}