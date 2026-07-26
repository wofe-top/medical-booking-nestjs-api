import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DoctorProfile } from './schemas/doctor-profile.schema';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { Appointment, AppointmentStatus } from '../appointments/schemas/appointment.schema';
import { DoctorSchedule, DayOfWeek } from './schemas/doctor-schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(DoctorProfile.name) private doctorProfileModel: Model<DoctorProfile>,
    @InjectModel(DoctorSchedule.name) private doctorScheduleModel: Model<DoctorSchedule>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) { }


  // Set or update a doctor working schedule for a specific day
  async setSchedule(userId: string, createScheduleDto: CreateScheduleDto) {
    const doctor = await this.doctorProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const schedule = await this.doctorScheduleModel.findOneAndUpdate(
      { doctorId: doctor._id, day: createScheduleDto.day },
      { ...createScheduleDto, doctorId: doctor._id },
      { upsert: true, new: true },
    );

    return {
      message: 'Working schedule updated successfully',
      schedule,
    };
  }


  // Calculate available slots dynamically for a doctor on a specific date
  async getAvailableSlots(doctorId: string, dateString: string) {
    const queryDate = new Date(dateString);
    if (isNaN(queryDate.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    // 1. Determine day of week
    const days: DayOfWeek[] = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];
    const dayOfWeek = days[queryDate.getDay()];

    // 2. Fetch doctor's working schedule for this day
    const schedule = await this.doctorScheduleModel.findOne({
      doctorId: new Types.ObjectId(doctorId),
      day: dayOfWeek,
    });

    if (!schedule) {
      return { availableSlots: [], message: 'Doctor does not work on this day' };
    }

    // 3. Generate all possible slots for the day
    const allSlots = this.generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.slotDurationMinutes,
    );

    // 4. Get already booked appointments for this doctor on this exact date
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const bookedAppointments = await this.appointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: AppointmentStatus.CANCELLED },
    });
    const bookedTimes = bookedAppointments.map((app) => {
      const d = new Date(app.appointmentDate);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    // 5. Filter out booked slots
    const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

    return {
      date: dateString,
      day: dayOfWeek,
      availableSlots,
    };
  }

  // Helper method to split work time into equal time slots
  private generateTimeSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
    const slots: string[] = [];
    let [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const m = (currentMinutes % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      currentMinutes += durationMinutes;
    }

    return slots;
  }

  async createProfile(userId: string, createDto: CreateDoctorProfileDto) {
    // Check if profile already exists for this doctor
    const existingProfile = await this.doctorProfileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (existingProfile) {
      throw new BadRequestException('Doctor profile already exists for this user');
    }

    const profile = await this.doctorProfileModel.create({
      userId: new Types.ObjectId(userId),
      ...createDto,
    });

    return {
      message: 'Doctor profile created successfully',
      profile,
    };
  }

  async findAll() {
    return this.doctorProfileModel
      .find()
      .populate('userId', 'name email')
      .populate('specialties', 'name description')
      .exec();
  }

  async findOne(id: string) {
    const profile = await this.doctorProfileModel
      .findById(id)
      .populate('userId', 'name email')
      .exec();

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateDto: UpdateDoctorProfileDto) {
    const profile = await this.doctorProfileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: updateDto },
      { new: true },
    );

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      message: 'Doctor profile updated successfully',
      profile,
    };
  }

  async filterDoctors(filters: { specialtyId?: string; minFee?: number; maxFee?: number; search?: string }) {
    const query: any = {};

    if (filters.specialtyId) {
      query.specialties = filters.specialtyId;
    }

    if (filters.minFee || filters.maxFee) {
      query.consultationFee = {};
      if (filters.minFee) query.consultationFee.$gte = filters.minFee;
      if (filters.maxFee) query.consultationFee.$lte = filters.maxFee;
    }

    return this.doctorProfileModel
      .find(query)
      .populate('userId', 'name email')
      .populate('specialties', 'name')
      .exec();
  }
}