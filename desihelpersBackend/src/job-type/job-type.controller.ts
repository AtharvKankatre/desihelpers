import { Controller, Get } from '@nestjs/common';

@Controller('job-type')
export class JobTypeController {
  @Get()
  async getJobTypes() {
    // TODO: Implement actual job types fetching from database
    return [
      { id: 1, name: 'Nanny', icon: 'nanny' },
      { id: 2, name: 'Caterer', icon: 'caterer' },
      { id: 3, name: 'Baker', icon: 'baker' },
      { id: 4, name: 'Tutor', icon: 'tutor' },
      { id: 5, name: 'Cleaner', icon: 'cleaner' },
      { id: 6, name: 'Driver', icon: 'driver' },
    ];
  }
}
