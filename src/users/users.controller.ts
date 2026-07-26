import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, Role } from './schemas/user.schema';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protect all routes in this controller
export class UsersController {

  // Accessible by authenticated users to get their own profile
  @Get('me')
  getProfile(@GetUser() user: User) {
    return {
      message: 'Profile retrieved successfully',
      user,
    };
  }

  // Accessible ONLY by Admin users
  @Get('admin-dashboard')
  @Roles(Role.ADMIN)
  getAdminData() {
    return {
      message: 'Welcome Admin! Access granted to sensitive data.',
    };
  }

  // Accessible by Doctors AND Admins
  @Get('doctor-analytics')
  @Roles(Role.DOCTOR, Role.ADMIN)
  getDoctorData(@GetUser('id') doctorId: string) {
    return {
      message: `Analytics for doctor ID: ${doctorId}`,
    };
  }
}