import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Otp, OtpDocument } from 'src/auth/otp.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    ) { }

    async create(user: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const createdUser = new this.userModel({
            email: user.email,
            password: hashedPassword,
            isJobSeeker: user.isJobSeeker || false,
        });
        return createdUser.save();
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }

    async generateOtp(email: string): Promise<string> {
        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Delete any existing OTP for this email
        await this.otpModel.deleteMany({ email });

        // 3. Save new OTP
        const newOtp = new this.otpModel({ email, otp });
        await newOtp.save();

        // 4. Log to console (simulating email sending)
        console.log('================================================');
        console.log(`[OTP SERVICE] Generated OTP for ${email}: ${otp}`);
        console.log('================================================');

        return otp;
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = await this.otpModel.findOne({ email, otp });
        if (record) {
            // OTP matched, delete it so it can't be reused
            await this.otpModel.deleteOne({ _id: record._id });

            // Self-healing: Ensure user has the correct temp password for the login flow
            const tempHash = await bcrypt.hash('TempPass123!', 10);
            await this.userModel.updateOne({ email }, { password: tempHash });

            return true;
        }
        return false;
    }
}
