import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration } from 'config/config';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { ClassroomsModule } from './class-room/class-room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
      }),
      inject: [ConfigService],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      global: true,
      inject: [ConfigService],
    }),

    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    MessagesModule,
    UsersModule,
    ClassroomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
