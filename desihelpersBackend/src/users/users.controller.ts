import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @Post('registration-otp')
    async registrationOtp(@Body('email') email: string) {
        if (!email) return { success: false, message: 'Email is required' };
        await this.usersService.generateOtp(email);
        return { success: true, message: 'OTP sent successfully' };
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: { email: string; otp: string }) {
        if (!body.email || !body.otp) {
            return { success: false, message: 'Email and OTP are required' };
        }
        const isValid = await this.usersService.verifyOtp(body.email, body.otp);
        if (isValid) {
            return { success: true, message: 'OTP verified successfully' };
        }
        return { success: false, message: 'Invalid OTP' };
    }

    @Post('resend-otp')
    async resendOtp(@Body('email') email: string) {
        if (!email) return { success: false, message: 'Email is required' };
        await this.usersService.generateOtp(email);
        return { success: true, message: 'OTP resent successfully' };
    }

    @Get('count')
    async countMembers() {
        return { count: 0 };
    }
}
