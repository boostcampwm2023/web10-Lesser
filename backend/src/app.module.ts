import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LesserConfigModule } from './lesser-config/lesser-config.module';
import { GithubApiModule } from './github-api/github-api.module';
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from './lesser-config/constants';
import { LesserJwtModule } from './lesser-jwt/lesser-jwt.module';
import { TempMember } from './auth/entity/tempMember.entity';
import { MemberModule } from './member/member.module';
import { Member } from './member/entity/member.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get(DATABASE_HOST),
        port: +ConfigService.get(DATABASE_PORT),
        username: ConfigService.get(DATABASE_USER),
        password: ConfigService.get(DATABASE_PASSWORD),
        database: ConfigService.get(DATABASE_NAME),
        entities: [Member, TempMember],
        synchronize: ConfigService.get('NODE_ENV') == 'PROD' ? false : true,
      }),
    }),
    AuthModule,
    LesserConfigModule,
    GithubApiModule,
    LesserJwtModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
