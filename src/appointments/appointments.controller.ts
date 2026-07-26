import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role, User } from '../users/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Appointments')
@ApiBearerAuth('JWT-auth') // Adds Authorization header field in Swagger UI
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // Patient route: Book a new appointment
  @Post()
  @Roles(Role.PATIENT)
  bookAppointment(@GetUser() user: User, @Body() createDto: CreateAppointmentDto) {
    return this.appointmentsService.bookAppointment(user._id.toString(), createDto);
  }

  // Patient route: Get list of my booked appointments
  @Get('my-appointments')
  @Roles(Role.PATIENT)
  getPatientAppointments(@GetUser() user: User) {
    return this.appointmentsService.getPatientAppointments(user._id.toString());
  }

  // Doctor route: Get appointments assigned to me
  @Get('doctor-schedule')
  @Roles(Role.DOCTOR)
  getDoctorAppointments(@GetUser() user: User) {
    return this.appointmentsService.getDoctorAppointments(user._id.toString());
  }

  // Shared route: Update appointment status (Doctor can confirm/complete, Patient can cancel)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      id,
      user._id.toString(),
      user.role,
      updateStatusDto,
    );
  }
}