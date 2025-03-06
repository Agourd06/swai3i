import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
import { User } from '../users/users.schema';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
  
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token);
  
        const user = await this.userModel.findById(payload.id)
          .select('-password') 
          .exec();
  
  
  
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
  
     
  
        request.user = user;
        request.userId = user._id;
  
        return true;
      } catch (error) {
        Logger.error(`Authentication error: ${error.message}`);
  
        if (error instanceof UnauthorizedException) {
          throw error;
        }
  
        throw new UnauthorizedException('Invalid token');
      }
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const authHeader = request.headers.authorization;
      return authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : undefined;
    }
  }