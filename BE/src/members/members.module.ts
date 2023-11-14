import { Module } from '@nestjs/common';
import { MembersService } from './members.service';

@Module({
  providers: [MembersService]
})
export class MembersModule {}
