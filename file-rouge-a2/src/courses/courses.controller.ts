import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put, 
    Delete, 
    Query, 
    UseGuards 
  } from '@nestjs/common';
  import { CoursesService } from './courses.service';
  import { CreateCourseDto } from './dto/create-course.dto';
  import { AuthGuard } from '../auth/auth.guard';
  import { CourseType } from './courses.schema';
  
  @Controller('courses')
  export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    async createCourse(@Body() createCourseDto: CreateCourseDto) {
      return this.coursesService.create(createCourseDto);
    }
  
    @Get()
    async findAll(
      @Query('subject') subject?: string,
      @Query('level') level?: string,
      @Query('city') city?: string,
      @Query('teacher') teacher?: string,
      @Query('courseType') courseType?: CourseType,
    ) {
      return this.coursesService.findAll({ subject, level, city, teacher, courseType });
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.coursesService.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
      @Param('id') id: string,
      @Body() updateCourseDto: Partial<CreateCourseDto>,
    ) {
      return this.coursesService.update(id, updateCourseDto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string) {
      return this.coursesService.remove(id);
    }
  
    @Get('teacher/:teacherId')
    @UseGuards(AuthGuard)
    async findCoursesByTeacherId(@Param('teacherId') teacherId: string) {
      return this.coursesService.findCoursesByTeacherId(teacherId);
    }
  }