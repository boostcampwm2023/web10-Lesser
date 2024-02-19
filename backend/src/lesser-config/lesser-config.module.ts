import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class LesserConfigModule {
    GITHUB_CLIENT_ID: 'GITHUB_CLIENT_ID'
}
