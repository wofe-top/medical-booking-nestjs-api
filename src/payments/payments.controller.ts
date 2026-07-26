import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role, User } from '../users/schemas/user.schema';

@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Patient route: Process payment for an appointment
  @Post()
  @Roles(Role.PATIENT)
  processPayment(@GetUser() user: User, @Body() createDto: CreatePaymentDto) {
    return this.paymentsService.processPayment(user._id.toString(), createDto);
  }

  // Get payment details for an appointment
  @Get('appointment/:appointmentId')
  getPaymentByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.paymentsService.getPaymentByAppointment(appointmentId);
  }

  // Admin & Doctor route: Update payment status (e.g. mark cash payment as COMPLETED)
  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.DOCTOR)
  updatePaymentStatus(
    @Param('id') paymentId: string,
    @Body() updateDto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updatePaymentStatus(paymentId, updateDto);
  }
}