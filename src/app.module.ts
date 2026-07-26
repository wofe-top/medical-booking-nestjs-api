import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SpecialtiesModule } from './specialties/specialties.module'
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],

    }),
    AuthModule,
    DoctorsModule,
    AppointmentsModule,
    PaymentsModule,
    SpecialtiesModule
  ],
})
export class AppModule { }