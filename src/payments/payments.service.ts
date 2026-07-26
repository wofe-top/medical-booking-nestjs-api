import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from './schemas/payment.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async processPayment(patientId: string, createDto: CreatePaymentDto) {
    const { appointmentId, amount, method, transactionId } = createDto;

    // 1. Check if appointment exists
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // 2. Check if payment already exists for this appointment
    const existingPayment = await this.paymentModel.findOne({
      appointmentId: new Types.ObjectId(appointmentId),
    });
    if (existingPayment) {
      throw new BadRequestException('Payment has already been created for this appointment');
    }

    // 3. Create payment record
    const payment = await this.paymentModel.create({
      appointmentId: new Types.ObjectId(appointmentId),
      patientId: new Types.ObjectId(patientId),
      amount,
      method,
      transactionId,
      status: method === 'CASH' ? PaymentStatus.PENDING : PaymentStatus.COMPLETED,
    });

    return {
      message: 'Payment processed successfully',
      payment,
    };
  }

  async getPaymentByAppointment(appointmentId: string) {
    const payment = await this.paymentModel
      .findOne({ appointmentId: new Types.ObjectId(appointmentId) })
      .populate('appointmentId')
      .populate('patientId', 'name email')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment record not found for this appointment');
    }

    return payment;
  }

  async updatePaymentStatus(paymentId: string, updateDto: UpdatePaymentStatusDto) {
    const payment = await this.paymentModel.findByIdAndUpdate(
      paymentId,
      { status: updateDto.status },
      { new: true },
    );

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    return {
      message: 'Payment status updated successfully',
      payment,
    };
  }
}