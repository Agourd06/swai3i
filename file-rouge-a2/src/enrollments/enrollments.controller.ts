import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Patch,
  Put
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CompleteEnrollmentDto } from './dto/complete-enrollment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { EnrollmentStatus } from './enrollment-status.enum';

@Controller('enrollments')
@UseGuards(AuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  async findAll(
    @Query('student') student?: string,
    @Query('course') course?: string,
    @Query('status') status?: EnrollmentStatus,
  ) {
    return this.enrollmentsService.findAll({ student, course, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Put(':id/complete')
  async completeEnrollment(
    @Param('id') id: string,
    @Body() completeEnrollmentDto: CompleteEnrollmentDto
  ) {
    return this.enrollmentsService.completeEnrollment(id, completeEnrollmentDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: EnrollmentStatus
  ) {
    return this.enrollmentsService.updateStatus(id, status);
  }

  @Put(':id/mark-paid')
  async markAsPaid(@Param('id') id: string) {
    return this.enrollmentsService.markAsPaid(id);
  }
} 