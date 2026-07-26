import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialty } from './schemas/specialty.schema';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectModel(Specialty.name) private specialtyModel: Model<Specialty>,
  ) {}

  async create(createDto: CreateSpecialtyDto) {
    const existing = await this.specialtyModel.findOne({ name: createDto.name });
    if (existing) {
      throw new BadRequestException('Specialty with this name already exists');
    }

    const specialty = await this.specialtyModel.create(createDto);
    return {
      message: 'Specialty created successfully',
      specialty,
    };
  }

  async findAll() {
    return this.specialtyModel.find({ isActive: true }).exec();
  }

  async findOne(id: string) {
    const specialty = await this.specialtyModel.findById(id);
    if (!specialty) {
      throw new NotFoundException('Specialty not found');
    }
    return specialty;
  }

  async update(id: string, updateDto: UpdateSpecialtyDto) {
    const specialty = await this.specialtyModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true },
    );

    if (!specialty) {
      throw new NotFoundException('Specialty not found');
    }

    return {
      message: 'Specialty updated successfully',
      specialty,
    };
  }

  async remove(id: string) {
    const specialty = await this.specialtyModel.findByIdAndDelete(id);
    if (!specialty) {
      throw new NotFoundException('Specialty not found');
    }
    return { message: 'Specialty deleted successfully' };
  }
}