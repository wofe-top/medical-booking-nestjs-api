import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  // Public route: Retrieve all active specialties
  @Get()
  findAll() {
    return this.specialtiesService.findAll();
  }

  // Public route: Get single specialty details
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialtiesService.findOne(id);
  }

  // Admin route: Create a new specialty
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DOCTOR , Role.ADMIN)
  create(@Body() createDto: CreateSpecialtyDto) {
    return this.specialtiesService.create(createDto);
  }

  // Admin route: Update specialty
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateSpecialtyDto) {
    return this.specialtiesService.update(id, updateDto);
  }

  // Admin route: Delete specialty
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.specialtiesService.remove(id);
  }
}