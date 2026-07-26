import { Body, Controller, Get, Param, Patch, Post,Query , UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorsService } from './doctors.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role, User } from '../users/schemas/user.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';


@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  // Public route: Fetch all doctors
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  // Public route: Fetch specific doctor by profile ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  // Protected route (DOCTOR only): Create doctor profile
  @Post('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCTOR)
  createProfile(@GetUser() user: User, @Body() createDto: CreateDoctorProfileDto) {
    return this.doctorsService.createProfile(user._id.toString(), createDto);
  }

  // Protected route (DOCTOR only): Update doctor profile / availability
  @Patch('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCTOR)
  updateProfile(@GetUser() user: User, @Body() updateDto: UpdateDoctorProfileDto) {
    return this.doctorsService.updateProfile(user._id.toString(), updateDto);
  }


  // Doctor route: Add/Update schedule
  @Post('schedule')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCTOR)
  setSchedule(@GetUser() user: User, @Body() createScheduleDto: CreateScheduleDto) {
    return this.doctorsService.setSchedule(user._id.toString(), createScheduleDto);
  }

  // Public route: Get available slots for a doctor on a specific date (e.g., /doctors/123/slots?date=2026-08-01)
  @Get(':id/slots')
  getAvailableSlots(@Param('id') doctorId: string, @Query('date') date: string) {
    return this.doctorsService.getAvailableSlots(doctorId, date);
  }
}