import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get('seeker/:seekerId')
  findAllBySeeker(@Param('seekerId') seekerId: string) {
    return this.feedbackService.findAllBySeeker(seekerId);
  }
}
