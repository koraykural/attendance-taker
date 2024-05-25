import { SkipAuth } from '@api/app/auth/skip-auth';
import { Controller, Get } from '@nestjs/common';

import { v4 as uuid } from 'uuid';

@Controller()
export class AppController {
  @Get()
  @SkipAuth()
  getData() {
    return { message: 'Welcome to api!' };
  }
}
