import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LesserJwtService } from './lesser-jwt.service';
import { LesserConfigModule } from 'src/lesser-config/lesser-config.module';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/lesser-config/constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [LesserConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
      }),
    }),
  ],
  providers: [LesserJwtService],
  exports: [LesserJwtService]
})
export class LesserJwtModule {}
