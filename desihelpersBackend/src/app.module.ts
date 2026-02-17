import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { JobTypeModule } from './job-type/job-type.module';
import { JobsModule } from './jobs/jobs.module';
import { FeedbackModule } from './feedback/feedback.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    UserProfileModule,
    JobTypeModule,
    JobsModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    const db = mongoose.connection;

    db.on('connected', () => {
      console.log(
        '✅ MongoDB connected successfully to:',
        db.host + ':' + db.port + '/' + db.name,
      );
    });

    db.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    db.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Log current state
    if (db.readyState === 1) {
      console.log(
        '✅ MongoDB already connected to:',
        db.host + ':' + db.port + '/' + db.name,
      );
    }
  }
}
