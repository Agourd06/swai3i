import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from './favorites.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>
  ) {}

  async addFavorite(studentId: string, courseId: string): Promise<Favorite> {
    const existingFavorite = await this.favoriteModel.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingFavorite) {
      throw new BadRequestException('Course already in favorites');
    }

    const favorite = new this.favoriteModel({
      student: studentId,
      course: courseId,
    });

    return favorite.save();
  }

  async removeFavorite(studentId: string, courseId: string): Promise<void> {
    const result = await this.favoriteModel.findOneAndDelete({
      student: studentId,
      course: courseId,
    });

    if (!result) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async getStudentFavorites(studentId: string): Promise<Favorite[]> {
    return this.favoriteModel
      .find({ student: studentId })
      .populate('course')
      .exec();
  }
} 