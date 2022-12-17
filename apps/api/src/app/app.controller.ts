import { Controller, Get } from '@nestjs/common';

import { v4 as uuid } from 'uuid';

@Controller()
export class AppController {
  @Get()
  getData() {
    return { code: uuid() };
  }
}
