import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema';
import { DoctorProfile } from '../doctors/schemas/doctor-profile.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(DoctorProfile.name) private doctorProfileModel: Model<DoctorProfile>,
  ) {}

  async bookAppointment(patientId: string, createDto: CreateAppointmentDto) {
    const { doctorId, appointmentDate } = createDto;

    // 1. Check if doctor profile exists and is available
    const doctor = await this.doctorProfileModel.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }
    if (!doctor.isAvailable) {
      throw new BadRequestException('This doctor is currently not accepting appointments');
    }

    // 2. Create the appointment
    const appointment = await this.appointmentModel.create({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(doctorId),
      appointmentDate: new Date(appointmentDate),
      status: AppointmentStatus.PENDING,
    });

    return {
      message: 'Appointment booked successfully',
      appointment,
    };
  }

  async getPatientAppointments(patientId: string) {
    return this.appointmentModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ appointmentDate: 1 })
      .exec();
  }

  async getDoctorAppointments(doctorUserId: string) {
    // 1. Find doctor profile associated with this user ID
    const doctorProfile = await this.doctorProfileModel.findOne({
      userId: new Types.ObjectId(doctorUserId),
    });

    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    // 2. Fetch appointments for this doctor
    return this.appointmentModel
      .find({ doctorId: doctorProfile._id })
      .populate('patientId', 'name email')
      .sort({ appointmentDate: 1 })
      .exec();
  }

  async updateAppointmentStatus(
    appointmentId: string,
    userId: string,
    userRole: string,
    updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Patients can only cancel their own appointments
    if (userRole === 'PATIENT') {
      if (appointment.patientId.toString() !== userId) {
        throw new ForbiddenException('You are not authorized to modify this appointment');
      }
      if (updateStatusDto.status !== AppointmentStatus.CANCELLED) {
        throw new BadRequestException('Patients can only cancel appointments');
      }
    }

    appointment.status = updateStatusDto.status;
    await appointment.save();

    return {
      message: 'Appointment status updated successfully',
      appointment,
    };
  }
}