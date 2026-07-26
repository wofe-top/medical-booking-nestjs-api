import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


import { User, Role } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { DoctorProfile } from '../doctors/schemas/doctor-profile.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(DoctorProfile.name) private doctorProfileModel: Model<DoctorProfile>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const {
            email,
            phone,
            password,
            name,
            role,
            gender,
            dateOfBirth,
            bio,
            consultationFee,
            specialtyIds
        } = registerDto;

        // 1. Check if email already exists
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new BadRequestException('Email is already registered');
            }
            if (existingUser.phone === phone) {
                throw new BadRequestException('Phone number is already registered');
            }
        }

        const userRole = role || Role.PATIENT;
        if (userRole === Role.DOCTOR) {
            if (!bio || consultationFee === undefined) {
                throw new BadRequestException('Bio and consultation fee are required when registering as a doctor');
            }
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create new user
        const newUser = await this.userModel.create({
            name,
            email,
            phone,
            password: hashedPassword,
            gender,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            role: userRole,
        });


        let doctorProfile: any = null;
        if (userRole === Role.DOCTOR) {
            doctorProfile = await this.doctorProfileModel.create({
                userId: newUser._id,
                bio,
                consultationFee,
                specialties: specialtyIds ? specialtyIds.map((id) => new Types.ObjectId(id)) : [],
            });
        }

        // 4. Generate JWT Token
        const token = this.generateToken(newUser._id.toString(), newUser.role);
        return {
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            },
            doctorProfile, // Returns profile details if doctor, or null if patient
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Find user by email
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // 2. Validate password
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // 3. Generate JWT Token
        const token = this.generateToken(user._id.toString(), user.role);

        return {
            message: 'Logged in successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        };
    }

    private generateToken(userId: string, role: string): string {
        return this.jwtService.sign({ id: userId, role });
    }
}