import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SprintsController } from './sprints/sprints.controller';
import { MembersController } from './members/members.controller';
import { ProjectsController } from './projects/Controller/projects.controller';
import { ReviewsController } from './reviews/reviews.controller';
import { BacklogsModule } from './backlogs/backlogs.module';
import { MembersModule } from './members/members.module';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SprintsModule } from './sprints/sprints.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LesserJwtModule } from './common/lesser-jwt/lesser-jwt.module';
import { AuthModule } from './common/auth/auth.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get('DATABASE_HOST'),
        port: +ConfigService.get('DATABASE_PORT'),
        username: ConfigService.get('DATABASE_USER'),
        password: ConfigService.get('DATABASE_PASSWORD'),
        database: ConfigService.get('DATABASE_NAME'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`, `${__dirname}/**/**/*.entity{.ts,.js}`],
        synchronize: ConfigService.get('LESSER_ENVIRONMENT') === 'deploy' ? false : true,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    BacklogsModule,
    MembersModule,
    ProjectsModule,
    ReviewsModule,
    SprintsModule,
    LesserJwtModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
