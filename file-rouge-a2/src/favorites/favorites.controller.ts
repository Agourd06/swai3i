import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':courseId')
  addFavorite(@GetUser() userId: string, @Param('courseId') courseId: string) {
    return this.favoritesService.addFavorite(userId, courseId);
  }

  @Delete(':courseId')
  removeFavorite(@GetUser() userId: string, @Param('courseId') courseId: string) {
    return this.favoritesService.removeFavorite(userId, courseId);
  }

  @Get('my-favorites')
  getMyFavorites(@GetUser() userId: string) {
    return this.favoritesService.getStudentFavorites(userId);
  }
} 