import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from '../schemas/job.schema';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobDto: any): Promise<Job> {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  async findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<Job[]> {
    return this.jobsService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Job> {
    return this.jobsService.findOne(id);
  }
}
