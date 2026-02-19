import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';

@Module({
  controllers: [UserProfileController],
  providers: [],
})
export class UserProfileModule {}
